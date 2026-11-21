-- Customer mid-trip route change requests; only the assigned Captain can accept them.
CREATE TABLE IF NOT EXISTS public.kida_trip_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.kida_bookings(id) ON DELETE RESTRICT,
  customer_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  captain_user_id text NOT NULL REFERENCES public.kida_captain_profiles(captain_user_id) ON DELETE RESTRICT,
  change_type text NOT NULL CHECK (change_type IN ('add_stop','change_destination')),
  requested_selection jsonb NOT NULL,
  proposed_dropoff jsonb NOT NULL,
  proposed_stops jsonb NOT NULL DEFAULT '[]'::jsonb,
  proposed_distance_km numeric(10,2) NOT NULL CHECK (proposed_distance_km > 0),
  proposed_minutes integer NOT NULL CHECK (proposed_minutes > 0),
  proposed_fare_paise bigint NOT NULL CHECK (proposed_fare_paise >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired','cancelled')),
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS kida_trip_change_one_pending_per_booking_uidx
  ON public.kida_trip_change_requests (booking_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS kida_trip_change_customer_idx
  ON public.kida_trip_change_requests (customer_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS kida_trip_change_captain_idx
  ON public.kida_trip_change_requests (captain_user_id, status, created_at DESC);

COMMENT ON TABLE public.kida_trip_change_requests IS
  'Customer requests to add a stop or change destination during a ride. Route and fare are server-calculated and only applied after the assigned Captain accepts.';
