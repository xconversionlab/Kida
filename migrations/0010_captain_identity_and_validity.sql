-- Kida Captain identity, profile photograph and document-validity controls.
ALTER TABLE public.kida_captain_applications
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS licence_identifier text,
  ADD COLUMN IF NOT EXISTS licence_expires_on date,
  ADD COLUMN IF NOT EXISTS commercial_permit_expires_on date,
  ADD COLUMN IF NOT EXISTS insurance_expires_on date,
  ADD COLUMN IF NOT EXISTS fitness_expires_on date,
  ADD COLUMN IF NOT EXISTS puc_expires_on date;

ALTER TABLE public.kida_captain_profiles
  ADD COLUMN IF NOT EXISTS profile_photo_url text,
  ADD COLUMN IF NOT EXISTS licence_identifier text,
  ADD COLUMN IF NOT EXISTS licence_expires_on date,
  ADD COLUMN IF NOT EXISTS commercial_permit_expires_on date,
  ADD COLUMN IF NOT EXISTS insurance_expires_on date,
  ADD COLUMN IF NOT EXISTS fitness_expires_on date,
  ADD COLUMN IF NOT EXISTS puc_expires_on date,
  ADD COLUMN IF NOT EXISTS photo_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS documents_verified_at timestamptz;

CREATE OR REPLACE FUNCTION public.kida_validate_captain_approval_evidence()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  application_row record;
BEGIN
  IF NEW.new_status = 'approved' THEN
    IF NEW.document_checks->>'captainPhoto' IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION 'Captain photograph must be reviewed before approval';
    END IF;

    SELECT photo_url, licence_identifier, licence_expires_on,
           commercial_permit_expires_on, insurance_expires_on,
           fitness_expires_on, puc_expires_on
      INTO application_row
      FROM public.kida_captain_applications
     WHERE id = NEW.application_id;

    IF application_row.photo_url IS NULL
       OR application_row.photo_url !~* '^https://[^[:space:]]+$' THEN
      RAISE EXCEPTION 'A secure hosted Captain photograph is required before approval';
    END IF;
    IF application_row.licence_identifier IS NULL
       OR char_length(trim(application_row.licence_identifier)) < 4 THEN
      RAISE EXCEPTION 'A verified driving-licence identifier is required before approval';
    END IF;
    IF application_row.licence_expires_on IS NULL
       OR application_row.licence_expires_on < current_date THEN
      RAISE EXCEPTION 'Driving licence must have a current validity date';
    END IF;
    IF application_row.commercial_permit_expires_on IS NULL
       OR application_row.commercial_permit_expires_on < current_date THEN
      RAISE EXCEPTION 'Commercial permit must have a current validity date';
    END IF;
    IF application_row.insurance_expires_on IS NULL
       OR application_row.insurance_expires_on < current_date THEN
      RAISE EXCEPTION 'Vehicle insurance must have a current validity date';
    END IF;
    IF application_row.fitness_expires_on IS NOT NULL
       AND application_row.fitness_expires_on < current_date THEN
      RAISE EXCEPTION 'Fitness certificate has expired';
    END IF;
    IF application_row.puc_expires_on IS NOT NULL
       AND application_row.puc_expires_on < current_date THEN
      RAISE EXCEPTION 'PUC certificate has expired';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS kida_captain_approval_evidence_guard ON public.kida_captain_application_reviews;
CREATE TRIGGER kida_captain_approval_evidence_guard
BEFORE INSERT ON public.kida_captain_application_reviews
FOR EACH ROW EXECUTE FUNCTION public.kida_validate_captain_approval_evidence();

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
      AND profile.approval_status = 'approved'
      AND profile.photo_verified_at IS NOT NULL
      AND profile.documents_verified_at IS NOT NULL
      AND profile.licence_expires_on IS NOT NULL
      AND profile.licence_expires_on >= current_date
      AND profile.commercial_permit_expires_on IS NOT NULL
      AND profile.commercial_permit_expires_on >= current_date
      AND profile.insurance_expires_on IS NOT NULL
      AND profile.insurance_expires_on >= current_date
      AND (profile.fitness_expires_on IS NULL OR profile.fitness_expires_on >= current_date)
      AND (profile.puc_expires_on IS NULL OR profile.puc_expires_on >= current_date)
      AND EXISTS (
        SELECT 1 FROM public.kida_user_roles role
         WHERE role.user_id = p_captain_user_id AND role.role = 'captain'
      )
    FROM public.kida_platform_settings settings
    JOIN public.kida_captain_wallets wallet
      ON wallet.captain_user_id = p_captain_user_id
    JOIN public.kida_captain_profiles profile
      ON profile.captain_user_id = p_captain_user_id
    WHERE settings.id = 1
  ), false);
$$;

COMMENT ON COLUMN public.kida_captain_profiles.photo_verified_at IS
  'Set only by the authorised Operations approval transaction after a Captain photograph has been reviewed.';
COMMENT ON COLUMN public.kida_captain_profiles.licence_identifier IS
  'Driving-licence identifier supplied for verification. Client must confirm whether this is the requested ULIN field and its exact definition.';
