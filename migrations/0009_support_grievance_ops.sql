ALTER TABLE public.kida_support_tickets
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  ADD COLUMN IF NOT EXISTS assigned_to text REFERENCES public."user"("id") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS resolution_note text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;
CREATE INDEX IF NOT EXISTS kida_support_tickets_queue_idx ON public.kida_support_tickets(status,priority,created_at DESC);
CREATE TABLE IF NOT EXISTS public.kida_support_ticket_events (
  id bigserial PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.kida_support_tickets(id) ON DELETE RESTRICT,
  actor_user_id text NOT NULL REFERENCES public."user"("id") ON DELETE RESTRICT,
  previous_status text, new_status text NOT NULL,
  previous_priority text, new_priority text NOT NULL,
  note text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kida_support_ticket_events_ticket_idx ON public.kida_support_ticket_events(ticket_id,created_at DESC);
COMMENT ON TABLE public.kida_support_ticket_events IS 'Append-only audit trail for Operations grievance case updates.';
