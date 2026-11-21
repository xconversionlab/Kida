-- Customer ratings for completed Captain trips.
CREATE TABLE IF NOT EXISTS public.kida_captain_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES public.kida_bookings(id) ON DELETE RESTRICT,
  customer_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  captain_user_id text NOT NULL REFERENCES public.kida_captain_profiles(captain_user_id) ON DELETE RESTRICT,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback text NOT NULL DEFAULT '' CHECK (char_length(feedback) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kida_captain_ratings_captain_idx
  ON public.kida_captain_ratings(captain_user_id, created_at DESC);

COMMENT ON TABLE public.kida_captain_ratings IS
  'One customer rating per completed booking. The assigned Captain is derived and verified by the server, never supplied by the customer.';
