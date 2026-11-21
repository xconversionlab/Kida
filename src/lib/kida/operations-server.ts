import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  isCaptainApplicationApprovalReady,
  type CaptainDocumentChecks,
} from "./operations-review";

const documentChecksSchema = z.object({
  identity: z.boolean(),
  drivingLicence: z.boolean(),
  commercialPermit: z.boolean(),
  insurance: z.boolean(),
  fitnessPuc: z.boolean(),
  vehicleRegistration: z.boolean(),
  captainPhoto: z.boolean(),
}).strict();

const reviewSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(["approved", "rejected", "needs_changes"]),
  reviewerNote: z.string().trim().min(4).max(1000),
  documentChecks: documentChecksSchema,
}).strict();

type ApplicationStatus = "pending_review" | "approved" | "rejected" | "needs_changes";



type OperationsTrip = {
  id: string;
  service_mode: string;
  status: string;
  vehicle_id: string;
  customer_name: string;
  pickup_label: string;
  pickup_line: string | null;
  pickup_latitude: string | null;
  pickup_longitude: string | null;
  dropoff_label: string;
  dropoff_line: string | null;
  captain_name: string | null;
  captain_registration_number: string | null;
  captain_city: string | null;
  captain_latitude: string | null;
  captain_longitude: string | null;
  captain_location_updated_at: string | null;
  fare_total: string | null;
  requested_at: string;
  scheduled_for: string | null;
  updated_at: string;
};

type OperationsTripSummary = {
  active_bookings: number;
  awaiting_captain: number;
  assigned_trips: number;
  in_progress: number;
  completed_today: number;
  online_captains: number;
};

type OperationsApplication = {
  id: string;
  user_id: string;
  full_name: string;
  phone_e164: string;
  account_name: string | null;
  account_email: string;
  vehicle_id: string;
  registration_number: string;
  vehicle_make_model: string;
  vehicle_colour: string;
  service_city: string;
  confirms_valid_driving_licence: boolean;
  confirms_commercial_permit: boolean;
  confirms_valid_insurance: boolean;
  photo_url: string;
  licence_identifier: string;
  licence_expires_on: string;
  commercial_permit_expires_on: string;
  insurance_expires_on: string;
  fitness_expires_on: string | null;
  puc_expires_on: string | null;
  status: ApplicationStatus;
  reviewer_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by_name: string | null;
  profile_approval_status: string | null;
  is_online: boolean | null;
  wallet_balance_paise: string | null;
  wallet_is_suspended: boolean | null;
  required_opening_balance_paise: string | null;
  can_accept_rides: boolean;
};

async function requireOperationsAdmin(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql.query<{ role: string }>(
    "select role from public.kida_user_roles where user_id = $1 and role = 'admin' limit 1",
    [userId],
  );
  if (!rows[0]) {
    throw new Error("This Kida account is not authorised for operations administration.");
  }
}

export const getOperationsDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireOperationsAdmin(sql, context.userId);

    const summaryRows = await sql.query<{
      total: number;
      pending_review: number;
      needs_changes: number;
      approved: number;
      rejected: number;
    }>(
      "select count(*)::int as total, " +
        "count(*) filter (where status = 'pending_review')::int as pending_review, " +
        "count(*) filter (where status = 'needs_changes')::int as needs_changes, " +
        "count(*) filter (where status = 'approved')::int as approved, " +
        "count(*) filter (where status = 'rejected')::int as rejected " +
        "from public.kida_captain_applications",
    );

    const settingsRows = await sql.query<{
      required_opening_balance_paise: string | null;
    }>(
      "select driver_required_opening_balance_paise::text as required_opening_balance_paise " +
        "from public.kida_platform_settings where id = 1 limit 1",
    );

    const applications = await sql.query<OperationsApplication>(
      [
        "select",
        " a.id::text as id, a.user_id, a.full_name, a.phone_e164,",
        ' u."name" as account_name, u."email" as account_email,',
        " a.vehicle_id, a.registration_number, a.vehicle_make_model,",
        " a.vehicle_colour, a.service_city,",
        " a.confirms_valid_driving_licence, a.confirms_commercial_permit,",
        " a.confirms_valid_insurance, a.photo_url, a.licence_identifier,",
        " a.licence_expires_on::text as licence_expires_on,",
        " a.commercial_permit_expires_on::text as commercial_permit_expires_on,",
        " a.insurance_expires_on::text as insurance_expires_on,",
        " a.fitness_expires_on::text as fitness_expires_on, a.puc_expires_on::text as puc_expires_on,",
        " a.status, a.reviewer_note,",
        " a.submitted_at::text as submitted_at, a.reviewed_at::text as reviewed_at,",
        ' reviewer."name" as reviewed_by_name,',
        " c.approval_status as profile_approval_status, c.is_online,",
        " w.balance_paise::text as wallet_balance_paise,",
        " w.is_suspended as wallet_is_suspended,",
        " s.driver_required_opening_balance_paise::text as required_opening_balance_paise,",
        " public.kida_captain_can_accept_rides(a.user_id) as can_accept_rides",
        "from public.kida_captain_applications a",
        'join public."user" u on u."id" = a.user_id',
        'left join public."user" reviewer on reviewer."id" = a.reviewed_by',
        "left join public.kida_captain_profiles c on c.captain_user_id = a.user_id",
        "left join public.kida_captain_wallets w on w.captain_user_id = a.user_id",
        "left join public.kida_platform_settings s on s.id = 1",
        "order by case a.status when 'pending_review' then 0 when 'needs_changes' then 1 when 'approved' then 2 else 3 end, a.submitted_at asc",
        "limit 250",
      ].join("\n"),
    );

    const trips = await sql.query<OperationsTrip>(
      `select
        b.id::text as id,
        b.service_mode,
        b.status,
        b.vehicle_id,
        coalesce(nullif(customer_profile.display_name, ''), nullif(customer_user."name", ''), 'Kida customer') as customer_name,
        coalesce(nullif(b.pickup->>'label', ''), nullif(b.pickup->>'line', ''), 'Pickup location') as pickup_label,
        nullif(b.pickup->>'line', '') as pickup_line,
        nullif(b.pickup->>'lat', '') as pickup_latitude,
        nullif(b.pickup->>'lng', '') as pickup_longitude,
        coalesce(nullif(b.dropoff->>'label', ''), nullif(b.dropoff->>'line', ''), 'Drop-off location') as dropoff_label,
        nullif(b.dropoff->>'line', '') as dropoff_line,
        captain_user."name" as captain_name,
        captain_profile.registration_number as captain_registration_number,
        captain_profile.service_city as captain_city,
        location.latitude::text as captain_latitude,
        location.longitude::text as captain_longitude,
        location.updated_at::text as captain_location_updated_at,
        b.client_fare_preview->>'total' as fare_total,
        b.requested_at::text as requested_at,
        b.scheduled_for::text as scheduled_for,
        b.updated_at::text as updated_at
      from public.kida_bookings b
      left join public."user" customer_user on customer_user."id" = b.user_id
      left join public.kida_profiles customer_profile on customer_profile.user_id = b.user_id
      left join public."user" captain_user on captain_user."id" = b.captain_user_id
      left join public.kida_captain_profiles captain_profile on captain_profile.captain_user_id = b.captain_user_id
      left join public.kida_captain_locations location
        on location.captain_user_id = b.captain_user_id
       and location.updated_at >= now() - interval '90 seconds'
      where b.status in ('requested','searching','accepted','captain_arriving','arrived','in_progress')
         or (b.status in ('completed','cancelled','expired','no_captain') and b.updated_at >= now() - interval '24 hours')
      order by case when b.status in ('requested','searching','accepted','captain_arriving','arrived','in_progress') then 0 else 1 end,
               b.updated_at desc
      limit 100
      `,
    );

    const tripSummaryRows = await sql.query<OperationsTripSummary>(
      `select
        count(*) filter (where status in ('requested','searching','accepted','captain_arriving','arrived','in_progress'))::int as active_bookings,
        count(*) filter (where status in ('requested','searching') and captain_user_id is null)::int as awaiting_captain,
        count(*) filter (where status in ('accepted','captain_arriving','arrived','in_progress'))::int as assigned_trips,
        count(*) filter (where status = 'in_progress')::int as in_progress,
        count(*) filter (where status = 'completed' and completed_at >= date_trunc('day', now()))::int as completed_today,
        (select count(*)::int from public.kida_captain_profiles where approval_status = 'approved' and is_online = true) as online_captains
      from public.kida_bookings
      `,
    );
    const requiredOpeningBalancePaise =
      settingsRows[0]?.required_opening_balance_paise ?? null;

    return {
      summary: summaryRows[0] ?? {
        total: 0,
        pending_review: 0,
        needs_changes: 0,
        approved: 0,
        rejected: 0,
      },
      walletPolicy: {
        requiredOpeningBalancePaise,
        isConfigured: requiredOpeningBalancePaise !== null,
      },
      applications,
      trips,
      tripSummary: tripSummaryRows[0] ?? {
        active_bookings: 0,
        awaiting_captain: 0,
        assigned_trips: 0,
        in_progress: 0,
        completed_today: 0,
        online_captains: 0,
      },
    };
  });

/**
 * Admin-only review transaction. Approval creates the Captain role, approved
 * profile and zero-balance wallet with an immutable review record. It never
 * inserts funds or bypasses kida_captain_can_accept_rides().
 */
export const reviewCaptainApplication = createServerFn({ method: "POST" })
  .validator((input: unknown) => reviewSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOperationsAdmin(sql, context.userId);

    if (
      data.decision === "approved" &&
      !isCaptainApplicationApprovalReady(data.documentChecks as CaptainDocumentChecks)
    ) {
      throw new Error("Approval requires verification of identity, driving licence, commercial permit, insurance, fitness/PUC and vehicle registration.");
    }

    const rows = await sql.query<{ id: string; status: ApplicationStatus }>(
      [
        "with target as materialized (",
        "  select id, user_id, vehicle_id, registration_number, vehicle_make_model, vehicle_colour, service_city,",
        "         photo_url, licence_identifier, licence_expires_on, commercial_permit_expires_on, insurance_expires_on, fitness_expires_on, puc_expires_on, status",
        "    from public.kida_captain_applications",
        "   where id = $1::uuid and status in ('pending_review','needs_changes')",
        "   for update",
        "), reviewed as (",
        "  update public.kida_captain_applications a",
        "     set status = $2, reviewer_note = $3, reviewed_by = $4, reviewed_at = now(), updated_at = now()",
        "    from target t where a.id = t.id",
        "   returning a.id, a.user_id, a.status",
        "), captain_role as (",
        "  insert into public.kida_user_roles (user_id, role, created_by)",
        "  select user_id, 'captain', $4 from reviewed where status = 'approved'",
        "  on conflict (user_id, role) do update set created_by = coalesce(public.kida_user_roles.created_by, excluded.created_by)",
        "  returning user_id",
        "), approved_profile as (",
        "  insert into public.kida_captain_profiles",
        "    (captain_user_id, vehicle_id, registration_number, vehicle_make_model, vehicle_colour, service_city, approval_status, is_online, approved_by, approved_at,",
        "     profile_photo_url, licence_identifier, licence_expires_on, commercial_permit_expires_on, insurance_expires_on, fitness_expires_on, puc_expires_on, photo_verified_at, documents_verified_at)",
        "  select t.user_id, t.vehicle_id, t.registration_number, t.vehicle_make_model, t.vehicle_colour, t.service_city, 'approved', false, $4, now(),",
        "         t.photo_url, t.licence_identifier, t.licence_expires_on, t.commercial_permit_expires_on, t.insurance_expires_on, t.fitness_expires_on, t.puc_expires_on, now(), now()",
        "    from target t join reviewed r on r.user_id = t.user_id where r.status = 'approved'",
        "  on conflict (captain_user_id) do update set",
        "    vehicle_id = excluded.vehicle_id, registration_number = excluded.registration_number,",
        "    vehicle_make_model = excluded.vehicle_make_model, vehicle_colour = excluded.vehicle_colour,",
        "    service_city = excluded.service_city, approval_status = 'approved', is_online = false,",
        "    profile_photo_url = excluded.profile_photo_url, licence_identifier = excluded.licence_identifier,",
        "    licence_expires_on = excluded.licence_expires_on, commercial_permit_expires_on = excluded.commercial_permit_expires_on,",
        "    insurance_expires_on = excluded.insurance_expires_on, fitness_expires_on = excluded.fitness_expires_on,",
        "    puc_expires_on = excluded.puc_expires_on, photo_verified_at = now(), documents_verified_at = now(),",
        "    approved_by = excluded.approved_by, approved_at = excluded.approved_at, updated_at = now()",
        "  returning captain_user_id",
        "), wallet_initialisation as (",
        "  insert into public.kida_captain_wallets (captain_user_id)",
        "  select user_id from reviewed where status = 'approved'",
        "  on conflict (captain_user_id) do update set updated_at = public.kida_captain_wallets.updated_at",
        "  returning captain_user_id",
        "), review_audit as (",
        "  insert into public.kida_captain_application_reviews",
        "    (application_id, applicant_user_id, reviewed_by, previous_status, new_status, reviewer_note, document_checks)",
        "  select r.id, r.user_id, $4, t.status, r.status, $3, $5::jsonb",
        "    from reviewed r join target t on t.id = r.id",
        "  returning application_id",
        ")",
        "select r.id::text as id, r.status",
        "  from reviewed r join review_audit audit on audit.application_id = r.id",
        " where r.status <> 'approved'",
        "    or (exists (select 1 from captain_role role where role.user_id = r.user_id)",
        "        and exists (select 1 from approved_profile profile where profile.captain_user_id = r.user_id)",
        "        and exists (select 1 from wallet_initialisation wallet where wallet.captain_user_id = r.user_id))",
      ].join("\n"),
      [
        data.applicationId,
        data.decision,
        data.reviewerNote,
        context.userId,
        JSON.stringify(data.documentChecks),
      ],
    );

    if (!rows[0]) {
      throw new Error("This application is no longer awaiting review. Refresh the dashboard and check its current status.");
    }
    return rows[0];
  });
