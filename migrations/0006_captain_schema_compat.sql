-- Forward-only compatibility for Captain schema changes that were added
-- after 0005_captain_app.sql had already been applied in some preview databases.

ALTER TABLE public.kida_bookings
  ADD COLUMN IF NOT EXISTS trip_pin_ciphertext text;

ALTER TABLE public.kida_captain_applications
  DROP CONSTRAINT IF EXISTS kida_captain_applications_vehicle_id_check;

ALTER TABLE public.kida_captain_applications
  ADD CONSTRAINT kida_captain_applications_vehicle_id_check
  CHECK (vehicle_id IN ('bike','auto','mini','sedan','xl'));

ALTER TABLE public.kida_captain_profiles
  DROP CONSTRAINT IF EXISTS kida_captain_profiles_vehicle_id_check;

ALTER TABLE public.kida_captain_profiles
  ADD CONSTRAINT kida_captain_profiles_vehicle_id_check
  CHECK (vehicle_id IN ('bike','auto','mini','sedan','xl'));

COMMENT ON COLUMN public.kida_bookings.trip_pin_ciphertext IS
  'AES-256-GCM encrypted customer trip PIN; only the booking owner can retrieve it through an authenticated customer endpoint.';
