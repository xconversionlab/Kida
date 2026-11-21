-- Kida Client Requirements V2 foundations.
-- Monetary values remain null/draft until explicitly approved by the client.
ALTER TABLE public.kida_bookings
  ADD COLUMN IF NOT EXISTS campaign_id uuid;

CREATE TABLE IF NOT EXISTS public.kida_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 3 AND 120),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','ended')),
  starts_at timestamptz,
  ends_at timestamptz,
  minimum_fare_paise bigint NOT NULL DEFAULT 0 CHECK (minimum_fare_paise >= 0),
  reward_type text NOT NULL CHECK (reward_type IN ('fixed_discount','percentage_discount','free_ride_cap')),
  reward_value integer NOT NULL CHECK (reward_value > 0),
  maximum_discount_paise bigint NOT NULL CHECK (maximum_discount_paise > 0),
  eligible_vehicle_ids text[] NOT NULL DEFAULT ARRAY['bike','auto','mini','xl']::text[],
  frequency_mode text NOT NULL CHECK (frequency_mode IN ('every_n','probability')),
  frequency_n integer,
  probability_bps integer,
  daily_budget_paise bigint CHECK (daily_budget_paise IS NULL OR daily_budget_paise > 0),
  weekly_budget_paise bigint CHECK (weekly_budget_paise IS NULL OR weekly_budget_paise > 0),
  max_uses_per_customer integer NOT NULL DEFAULT 1 CHECK (max_uses_per_customer BETWEEN 1 AND 100),
  first_ride_only boolean NOT NULL DEFAULT false,
  second_ride_only boolean NOT NULL DEFAULT false,
  office_start_time time,
  office_end_time time,
  office_area_label text,
  created_by text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  updated_by text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kida_campaign_frequency_check CHECK (
    (frequency_mode = 'every_n' AND frequency_n BETWEEN 2 AND 1000 AND probability_bps IS NULL)
    OR
    (frequency_mode = 'probability' AND probability_bps BETWEEN 1 AND 10000 AND frequency_n IS NULL)
  ),
  CONSTRAINT kida_campaign_period_check CHECK (
    starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at
  ),
  CONSTRAINT kida_campaign_first_second_check CHECK (NOT (first_ride_only AND second_ride_only))
);

CREATE INDEX IF NOT EXISTS kida_campaigns_status_period_idx
  ON public.kida_campaigns (status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS public.kida_campaign_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.kida_campaigns(id) ON DELETE RESTRICT,
  booking_id uuid NOT NULL UNIQUE REFERENCES public.kida_bookings(id) ON DELETE RESTRICT,
  customer_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved','completed','cancelled','reversed')),
  discount_paise bigint NOT NULL CHECK (discount_paise >= 0),
  company_funded_paise bigint NOT NULL CHECK (company_funded_paise >= 0),
  area_label text,
  used_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_campaign_redemptions_campaign_date_idx
  ON public.kida_campaign_redemptions (campaign_id, used_at DESC);

CREATE INDEX IF NOT EXISTS kida_campaign_redemptions_customer_idx
  ON public.kida_campaign_redemptions (campaign_id, customer_user_id, used_at DESC);

CREATE TABLE IF NOT EXISTS public.kida_campaign_audit (
  id bigserial PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.kida_campaigns(id) ON DELETE RESTRICT,
  actor_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  action text NOT NULL CHECK (action IN ('created','updated','activated','paused','ended')),
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kida_captain_work_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_user_id text NOT NULL REFERENCES public.kida_captain_profiles(captain_user_id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS kida_captain_one_open_work_session_uidx
  ON public.kida_captain_work_sessions (captain_user_id)
  WHERE ended_at IS NULL;

CREATE INDEX IF NOT EXISTS kida_captain_work_sessions_day_idx
  ON public.kida_captain_work_sessions (captain_user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS public.kida_captain_sos_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_user_id text NOT NULL REFERENCES public.kida_captain_profiles(captain_user_id) ON DELETE RESTRICT,
  booking_id uuid REFERENCES public.kida_bookings(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('captain_safety','passenger_safety','vehicle_safety','medical','other')),
  latitude double precision,
  longitude double precision,
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded','acknowledged','resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((latitude IS NULL) = (longitude IS NULL)),
  CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS kida_captain_sos_alerts_created_idx
  ON public.kida_captain_sos_alerts (created_at DESC);

CREATE TABLE IF NOT EXISTS public.kida_captain_payout_preferences (
  captain_user_id text PRIMARY KEY REFERENCES public.kida_captain_profiles(captain_user_id) ON DELETE CASCADE,
  requested_schedule text NOT NULL CHECK (requested_schedule IN ('weekly','every_3_days')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kida_trip_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.kida_bookings(id) ON DELETE CASCADE,
  customer_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_trip_shares_booking_idx
  ON public.kida_trip_shares (booking_id, expires_at DESC);

COMMENT ON TABLE public.kida_campaigns IS
  'Operations-managed campaign rules. All currency columns are paise. Draft until client-approved values and terms are entered.';
COMMENT ON TABLE public.kida_campaign_redemptions IS
  'Auditable campaign reservations and completions; redemption is not a payment settlement.';
COMMENT ON TABLE public.kida_captain_work_sessions IS
  'Captain availability sessions used to enforce the configured 8-hour daily online-time ceiling; client must confirm the official interpretation.';
COMMENT ON TABLE public.kida_captain_sos_alerts IS
  'Persisted Captain SOS records. This table does not notify a staffed response centre or emergency services.';
COMMENT ON TABLE public.kida_trip_shares IS
  'Short-lived trip-share tokens. Only a one-way SHA-256 hash is stored; raw bearer tokens are returned once to the booking owner.';
