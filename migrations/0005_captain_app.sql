-- Kida Captain App V1: Captain applications, approved profiles, location and trip verification.
-- Captain accounts are provisioned only by an administrator after offline document review.
-- No public endpoint can grant the captain role or mark an application approved.

ALTER TABLE public.kida_bookings
  ADD COLUMN IF NOT EXISTS trip_pin_hash text;

CREATE TABLE IF NOT EXISTS public.kida_captain_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE REFERENCES public."user" ("id") ON DELETE RESTRICT,
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone_e164 text NOT NULL CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  vehicle_id text NOT NULL CHECK (vehicle_id IN ('bike','auto','mini','xl')),
  registration_number text NOT NULL CHECK (char_length(registration_number) BETWEEN 5 AND 20),
  vehicle_make_model text NOT NULL CHECK (char_length(vehicle_make_model) BETWEEN 2 AND 100),
  vehicle_colour text NOT NULL CHECK (char_length(vehicle_colour) BETWEEN 2 AND 40),
  service_city text NOT NULL CHECK (char_length(service_city) BETWEEN 2 AND 100),
  confirms_valid_driving_licence boolean NOT NULL,
  confirms_commercial_permit boolean NOT NULL,
  confirms_valid_insurance boolean NOT NULL,
  status text NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','approved','rejected','needs_changes')),
  reviewer_note text,
  reviewed_by text REFERENCES public."user" ("id") ON DELETE SET NULL,
  reviewed_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_captain_applications_status_idx
  ON public.kida_captain_applications (status, submitted_at);

CREATE TABLE IF NOT EXISTS public.kida_captain_profiles (
  captain_user_id text PRIMARY KEY REFERENCES public."user" ("id") ON DELETE RESTRICT,
  vehicle_id text NOT NULL CHECK (vehicle_id IN ('bike','auto','mini','xl')),
  registration_number text NOT NULL UNIQUE,
  vehicle_make_model text NOT NULL,
  vehicle_colour text NOT NULL,
  service_city text NOT NULL,
  approval_status text NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected','suspended')),
  -- This flag is set only after manual KYC verification; it is never self-declared.
  is_woman_captain boolean NOT NULL DEFAULT false,
  is_online boolean NOT NULL DEFAULT false,
  approved_by text REFERENCES public."user" ("id") ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_captain_profiles_dispatch_idx
  ON public.kida_captain_profiles (service_city, vehicle_id, is_online)
  WHERE approval_status = 'approved';

CREATE TABLE IF NOT EXISTS public.kida_captain_locations (
  captain_user_id text PRIMARY KEY REFERENCES public.kida_captain_profiles (captain_user_id) ON DELETE CASCADE,
  latitude numeric(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  accuracy_m numeric(8,2),
  heading_deg numeric(6,2) CHECK (heading_deg IS NULL OR heading_deg BETWEEN 0 AND 360),
  speed_mps numeric(8,2) CHECK (speed_mps IS NULL OR speed_mps >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_captain_locations_updated_idx
  ON public.kida_captain_locations (updated_at DESC);

COMMENT ON TABLE public.kida_captain_applications IS
  'Captain applications. This table stores declarations and vehicle details only; document verification is performed by an authorised Kida operator outside this form.';
COMMENT ON TABLE public.kida_captain_profiles IS
  'Administrator-approved Captain operating profile. Only verified Captains can be assigned to bookings.';
COMMENT ON TABLE public.kida_captain_locations IS
  'Latest Captain GPS fix. Read by the customer only for that customer booking while a trip is active.';
COMMENT ON COLUMN public.kida_bookings.trip_pin_hash IS
  'HMAC of the four-digit customer trip PIN, bound to booking ID; used by Captain to verify pickup before starting the trip.';
