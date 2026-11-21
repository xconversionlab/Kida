-- Immutable operations review history for Captain onboarding.
-- Document files and document numbers are not stored by this migration.
CREATE TABLE IF NOT EXISTS public.kida_captain_application_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES public.kida_captain_applications (id) ON DELETE RESTRICT,
  applicant_user_id text NOT NULL REFERENCES public."user" ("id") ON DELETE RESTRICT,
  reviewed_by text NOT NULL REFERENCES public."user" ("id") ON DELETE RESTRICT,
  previous_status text NOT NULL CHECK (previous_status IN ('pending_review','needs_changes','rejected')),
  new_status text NOT NULL CHECK (new_status IN ('approved','rejected','needs_changes')),
  reviewer_note text NOT NULL CHECK (char_length(reviewer_note) BETWEEN 4 AND 1000),
  document_checks jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(document_checks) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kida_captain_application_review_approval_checks CHECK (
    new_status <> 'approved'
    OR document_checks @> '{
      "identity": true,
      "drivingLicence": true,
      "commercialPermit": true,
      "insurance": true,
      "fitnessPuc": true,
      "vehicleRegistration": true
    }'::jsonb
  )
);

CREATE INDEX IF NOT EXISTS kida_captain_application_reviews_application_created_idx
  ON public.kida_captain_application_reviews (application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS kida_captain_application_reviews_reviewer_created_idx
  ON public.kida_captain_application_reviews (reviewed_by, created_at DESC);

CREATE OR REPLACE FUNCTION public.kida_reject_captain_review_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  RAISE EXCEPTION 'Kida Captain application review history is append-only';
END;
$function$;

DROP TRIGGER IF EXISTS kida_captain_application_reviews_immutable ON public.kida_captain_application_reviews;
CREATE TRIGGER kida_captain_application_reviews_immutable
BEFORE UPDATE OR DELETE ON public.kida_captain_application_reviews
FOR EACH ROW EXECUTE FUNCTION public.kida_reject_captain_review_mutation();

COMMENT ON TABLE public.kida_captain_application_reviews IS
  'Append-only audit history for operations decisions on Captain applications. Verification checkboxes record that original documents were physically reviewed; document images and numbers are not stored.';
