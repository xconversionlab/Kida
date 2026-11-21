-- Campaign terms cannot be activated until a Kida admin records explicit client approval.
ALTER TABLE public.kida_campaigns
  ADD COLUMN IF NOT EXISTS client_approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_approved_at timestamptz;

COMMENT ON COLUMN public.kida_campaigns.client_approved IS
  'Explicit Kida Operations confirmation that the exact campaign terms and monetary amounts were approved by the client.';
