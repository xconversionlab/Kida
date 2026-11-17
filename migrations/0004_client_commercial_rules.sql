-- Kida client-approved commercial rules and Partner financial ledger foundation.
-- No payment or Captain acceptance API is enabled by this migration alone.

ALTER TABLE public.kida_bookings
  ADD COLUMN IF NOT EXISTS is_free_ride boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS customer_reward_cycle integer,
  ADD COLUMN IF NOT EXISTS captain_user_id text REFERENCES public."user" ("id") ON DELETE RESTRICT;

ALTER TABLE public.kida_bookings
  ADD CONSTRAINT kida_bookings_free_ride_cycle_check
  CHECK ((NOT is_free_ride) OR customer_reward_cycle IS NOT NULL);

CREATE UNIQUE INDEX IF NOT EXISTS kida_bookings_customer_reward_cycle_uidx
  ON public.kida_bookings (user_id, customer_reward_cycle)
  WHERE is_free_ride = true
    AND customer_reward_cycle IS NOT NULL
    AND status NOT IN ('cancelled', 'expired', 'no_captain');

CREATE INDEX IF NOT EXISTS kida_bookings_captain_created_idx
  ON public.kida_bookings (captain_user_id, created_at DESC)
  WHERE captain_user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.kida_platform_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  platform_commission_percent smallint NOT NULL DEFAULT 20
    CHECK (platform_commission_percent BETWEEN 0 AND 100),
  captain_share_percent smallint NOT NULL DEFAULT 80
    CHECK (captain_share_percent BETWEEN 0 AND 100),
  customer_paid_rides_for_free smallint NOT NULL DEFAULT 5
    CHECK (customer_paid_rides_for_free > 0),
  customer_free_ride_max_km numeric(6,2) NOT NULL DEFAULT 7.00
    CHECK (customer_free_ride_max_km > 0),
  driver_daily_bonus_completed_rides smallint NOT NULL DEFAULT 15
    CHECK (driver_daily_bonus_completed_rides > 0),
  driver_daily_bonus_amount_paise bigint NOT NULL DEFAULT 20000
    CHECK (driver_daily_bonus_amount_paise >= 0),
  -- The client has not supplied the compulsory opening ledger amount.
  -- Keep it unset; Captain acceptance remains disabled until an admin configures it.
  driver_required_opening_balance_paise bigint
    CHECK (driver_required_opening_balance_paise IS NULL OR driver_required_opening_balance_paise >= 0),
  business_timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kida_platform_split_totals_100
    CHECK (platform_commission_percent + captain_share_percent = 100)
);

INSERT INTO public.kida_platform_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.kida_captain_wallets (
  captain_user_id text PRIMARY KEY REFERENCES public."user" ("id") ON DELETE RESTRICT,
  opening_balance_paise bigint NOT NULL DEFAULT 0,
  balance_paise bigint NOT NULL DEFAULT 0,
  opening_balance_date date,
  is_suspended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kida_captain_ledger_entries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  captain_user_id text NOT NULL REFERENCES public.kida_captain_wallets (captain_user_id) ON DELETE RESTRICT,
  booking_id uuid REFERENCES public.kida_bookings (id) ON DELETE RESTRICT,
  entry_type text NOT NULL CHECK (entry_type IN (
    'opening_balance', 'top_up', 'trip_earning', 'platform_commission',
    'free_ride_company_payout', 'daily_bonus', 'refund', 'adjustment'
  )),
  direction text NOT NULL CHECK (direction IN ('credit', 'debit')),
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  balance_after_paise bigint NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_captain_ledger_entries_captain_created_idx
  ON public.kida_captain_ledger_entries (captain_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.kida_booking_financials (
  booking_id uuid PRIMARY KEY REFERENCES public.kida_bookings (id) ON DELETE RESTRICT,
  captain_user_id text NOT NULL REFERENCES public.kida_captain_wallets (captain_user_id) ON DELETE RESTRICT,
  gross_fare_paise bigint NOT NULL CHECK (gross_fare_paise >= 0),
  customer_due_paise bigint NOT NULL CHECK (customer_due_paise >= 0),
  captain_earnings_paise bigint NOT NULL CHECK (captain_earnings_paise >= 0),
  platform_commission_paise bigint NOT NULL CHECK (platform_commission_paise >= 0),
  company_subsidy_paise bigint NOT NULL DEFAULT 0 CHECK (company_subsidy_paise >= 0),
  collection_method text NOT NULL CHECK (collection_method IN ('platform', 'captain_direct', 'cash')),
  settlement_status text NOT NULL DEFAULT 'pending'
    CHECK (settlement_status IN ('pending', 'settled', 'reversed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz,
  CONSTRAINT kida_booking_financials_allocation_check CHECK (
    (
      customer_due_paise = 0
      AND company_subsidy_paise = gross_fare_paise
      AND captain_earnings_paise = gross_fare_paise
      AND platform_commission_paise = 0
    )
    OR
    (
      customer_due_paise = gross_fare_paise
      AND company_subsidy_paise = 0
      AND captain_earnings_paise + platform_commission_paise = gross_fare_paise
    )
  )
);

CREATE TABLE IF NOT EXISTS public.kida_captain_daily_bonus_awards (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  captain_user_id text NOT NULL REFERENCES public.kida_captain_wallets (captain_user_id) ON DELETE RESTRICT,
  service_date date NOT NULL,
  completed_ride_count integer NOT NULL CHECK (completed_ride_count >= 15),
  bonus_amount_paise bigint NOT NULL DEFAULT 20000 CHECK (bonus_amount_paise = 20000),
  ledger_entry_id bigint REFERENCES public.kida_captain_ledger_entries (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (captain_user_id, service_date)
);

-- A Captain can accept trips only after the company has configured the required
-- opening ledger amount and the Captain's available ledger balance meets it.
CREATE OR REPLACE FUNCTION public.kida_captain_can_accept_rides(p_captain_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((
    SELECT
      settings.driver_required_opening_balance_paise IS NOT NULL
      AND wallet.balance_paise >= settings.driver_required_opening_balance_paise
      AND wallet.is_suspended = false
      AND EXISTS (
        SELECT 1
          FROM public.kida_user_roles role
         WHERE role.user_id = p_captain_user_id
           AND role.role = 'captain'
      )
    FROM public.kida_platform_settings settings
    JOIN public.kida_captain_wallets wallet
      ON wallet.captain_user_id = p_captain_user_id
    WHERE settings.id = 1
  ), false);
$$;

COMMENT ON TABLE public.kida_captain_ledger_entries IS
  'Append-only accounting entries for Captain opening balances, top-ups, trip earnings, company commission, free-ride payouts and daily bonuses.';
COMMENT ON TABLE public.kida_booking_financials IS
  'Server-created financial allocation for completed trips. Customer fare previews are not authoritative settlement records.';
COMMENT ON COLUMN public.kida_platform_settings.driver_required_opening_balance_paise IS
  'Required opening wallet balance in paise. Null until the company supplies and configures the compulsory amount.';
