import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "./booking-state";
import { createTripPinCredentials, decryptTripPin, matchesTripPin } from "./trip-pin";

const vehicleSchema = z.enum(["bike", "auto", "mini", "sedan", "xl"]);

function captainMatchRadiusKm(): number {
  const configured = Number(process.env.KIDA_CAPTAIN_MATCH_RADIUS_KM ?? "20");
  return Number.isFinite(configured) && configured >= 1 && configured <= 100 ? configured : 20;
}
const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phoneE164: z.string().trim().regex(/^\+[1-9][0-9]{7,14}$/),
  vehicleId: vehicleSchema,
  registrationNumber: z.string().trim().toUpperCase().regex(/^[A-Z0-9 -]{5,20}$/),
  vehicleMakeModel: z.string().trim().min(2).max(100),
  vehicleColour: z.string().trim().min(2).max(40),
  serviceCity: z.string().trim().min(2).max(100),
  confirmsValidDrivingLicence: z.literal(true),
  confirmsCommercialPermit: z.literal(true),
  confirmsValidInsurance: z.literal(true),
}).strict();

const onlineSchema = z.object({ isOnline: z.boolean() }).strict();
const acceptSchema = z.object({ bookingId: z.string().uuid() }).strict();
const locationSchema = z.object({
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
  accuracyM: z.number().finite().min(0).max(10000).nullable().optional(),
  headingDeg: z.number().finite().min(0).max(360).nullable().optional(),
  speedMps: z.number().finite().min(0).max(150).nullable().optional(),
}).strict();
const transitionSchema = z.object({
  bookingId: z.string().uuid(),
  toStatus: z.enum(["captain_arriving", "arrived", "in_progress", "completed", "cancelled"]),
  tripPin: z.string().regex(/^\d{4}$/).optional(),
  reason: z.string().trim().min(3).max(240).optional(),
}).strict().superRefine((data, ctx) => {
  if (data.toStatus === "in_progress" && !data.tripPin) {
    ctx.addIssue({ code: "custom", path: ["tripPin"], message: "The customer's four-digit trip PIN is required to start a ride." });
  }
  if (data.toStatus === "cancelled" && !data.reason) {
    ctx.addIssue({ code: "custom", path: ["reason"], message: "A cancellation reason is required." });
  }
});
const pinSchema = z.object({
  bookingId: z.string().uuid(),
  tripPin: z.string().regex(/^\d{4}$/),
}).strict();

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

type ApplicationRow = {
  id: string;
  status: string;
  full_name: string;
  phone_e164: string;
  vehicle_id: string;
  registration_number: string;
  vehicle_make_model: string;
  vehicle_colour: string;
  service_city: string;
  reviewer_note: string | null;
  submitted_at: string;
};

type ProfileRow = {
  captain_user_id: string;
  vehicle_id: string;
  registration_number: string;
  vehicle_make_model: string;
  vehicle_colour: string;
  service_city: string;
  approval_status: string;
  is_online: boolean;
  is_woman_captain: boolean;
};

type BookingCardRow = {
  id: string;
  status: BookingStatus;
  vehicle_id: string;
  pickup: JsonObject;
  dropoff: JsonObject;
  stops: JsonObject[];
  client_fare_preview: JsonObject | null;
  is_free_ride: boolean;
  payment_method: string;
  women_driver_requested: boolean;
  scheduled_for: string | null;
  requested_at: string;
  customer_name?: string | null;
};

async function requireCaptain(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql.query<ProfileRow>(
    `select c.captain_user_id, c.vehicle_id, c.registration_number,
            c.vehicle_make_model, c.vehicle_colour, c.service_city,
            c.approval_status, c.is_online, c.is_woman_captain
       from public.kida_captain_profiles c
       join public.kida_user_roles r
         on r.user_id = c.captain_user_id and r.role = 'captain'
      where c.captain_user_id = $1
      limit 1`,
    [userId],
  );
  if (!rows[0]) throw new Error("Your Kida Captain account is not activated. Submit an application or contact Kida operations.");
  if (rows[0].approval_status !== "approved") {
    throw new Error("Your Captain profile has not been approved for trips.");
  }
  return rows[0];
}

/** Public application intake. It never grants the Captain role or approves KYC. */
export const applyForCaptain = createServerFn({ method: "POST" })
  .validator((input: unknown) => applicationSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existingRole = await sql.query<{ role: string }>(
      "select role from public.kida_user_roles where user_id = $1 and role = 'captain' limit 1",
      [context.userId],
    );
    if (existingRole[0]) throw new Error("This account is already registered as a Kida Captain.");

    const inserted = await sql.query<ApplicationRow>(
      `insert into public.kida_captain_applications
         (user_id, full_name, phone_e164, vehicle_id, registration_number,
          vehicle_make_model, vehicle_colour, service_city,
          confirms_valid_driving_licence, confirms_commercial_permit, confirms_valid_insurance)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       on conflict (user_id) do update set
         full_name = excluded.full_name,
         phone_e164 = excluded.phone_e164,
         vehicle_id = excluded.vehicle_id,
         registration_number = excluded.registration_number,
         vehicle_make_model = excluded.vehicle_make_model,
         vehicle_colour = excluded.vehicle_colour,
         service_city = excluded.service_city,
         confirms_valid_driving_licence = excluded.confirms_valid_driving_licence,
         confirms_commercial_permit = excluded.confirms_commercial_permit,
         confirms_valid_insurance = excluded.confirms_valid_insurance,
         status = 'pending_review',
         reviewer_note = null,
         reviewed_by = null,
         reviewed_at = null,
         updated_at = now()
       where public.kida_captain_applications.status in ('rejected','needs_changes')
       returning id::text as id, status, full_name, phone_e164, vehicle_id,
                 registration_number, vehicle_make_model, vehicle_colour,
                 service_city, reviewer_note, submitted_at::text as submitted_at`,
      [
        context.userId,
        data.fullName,
        data.phoneE164,
        data.vehicleId,
        data.registrationNumber,
        data.vehicleMakeModel,
        data.vehicleColour,
        data.serviceCity,
        data.confirmsValidDrivingLicence,
        data.confirmsCommercialPermit,
        data.confirmsValidInsurance,
      ],
    );
    if (inserted[0]) return inserted[0];

    const prior = await sql.query<ApplicationRow>(
      `select id::text as id, status, full_name, phone_e164, vehicle_id,
              registration_number, vehicle_make_model, vehicle_colour,
              service_city, reviewer_note, submitted_at::text as submitted_at
         from public.kida_captain_applications
        where user_id = $1 limit 1`,
      [context.userId],
    );
    if (prior[0]) {
      if (prior[0].status === "approved") throw new Error("Your Captain application is already approved.");
      if (prior[0].status === "pending_review") throw new Error("Your Captain application is already awaiting review.");
    }
    throw new Error("The Captain application could not be saved. Please retry.");
  });

/** Dashboard state for the signed-in Captain. Unapproved users receive no trip/customer data. */
export const getMyCaptainPortal = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const roles = await sql.query<{ role: string }>(
      "select role from public.kida_user_roles where user_id = $1 order by role",
      [context.userId],
    );
    const hasCaptainRole = roles.some((item) => item.role === "captain");
    const applications = await sql.query<ApplicationRow>(
      `select id::text as id, status, full_name, phone_e164, vehicle_id,
              registration_number, vehicle_make_model, vehicle_colour,
              service_city, reviewer_note, submitted_at::text as submitted_at
         from public.kida_captain_applications
        where user_id = $1 limit 1`,
      [context.userId],
    );
    const application = applications[0] ?? null;
    if (!hasCaptainRole) {
      return {
        hasCaptainRole: false,
        application,
        profile: null,
        wallet: null,
        canAcceptRides: false,
        availableBookings: [] as BookingCardRow[],
        activeBooking: null as (BookingCardRow & { customer_name: string | null }) | null,
        completedToday: 0,
      };
    }

    const profileRows = await sql.query<ProfileRow>(
      `select captain_user_id, vehicle_id, registration_number, vehicle_make_model,
              vehicle_colour, service_city, approval_status, is_online, is_woman_captain
         from public.kida_captain_profiles
        where captain_user_id = $1 limit 1`,
      [context.userId],
    );
    const profile = profileRows[0] ?? null;
    if (!profile || profile.approval_status !== "approved") {
      return {
        hasCaptainRole: true,
        application,
        profile,
        wallet: null,
        canAcceptRides: false,
        availableBookings: [] as BookingCardRow[],
        activeBooking: null as (BookingCardRow & { customer_name: string | null }) | null,
        completedToday: 0,
      };
    }

    const walletRows = await sql.query<{
      balance_paise: string | number | null;
      required_balance_paise: string | number | null;
      can_accept_rides: boolean;
      is_suspended: boolean | null;
    }>(
      `select w.balance_paise::text as balance_paise,
              s.driver_required_opening_balance_paise::text as required_balance_paise,
              public.kida_captain_can_accept_rides($1) as can_accept_rides,
              w.is_suspended
         from public.kida_platform_settings s
         left join public.kida_captain_wallets w on w.captain_user_id = $1
        where s.id = 1 limit 1`,
      [context.userId],
    );
    const wallet = walletRows[0] ?? null;
    const canAcceptRides = Boolean(wallet?.can_accept_rides);
    const matchRadiusKm = captainMatchRadiusKm();

    const availableBookings = canAcceptRides && profile.is_online
      ? await sql.query<BookingCardRow>(
          `select b.id::text as id, b.status, b.vehicle_id, b.pickup, b.dropoff, b.stops,
                  b.client_fare_preview, b.is_free_ride, b.payment_method,
                  b.women_driver_requested, b.scheduled_for::text as scheduled_for,
                  b.requested_at::text as requested_at
             from public.kida_bookings b
            where b.service_mode = 'ride'
              and b.vehicle_id = $2
              and b.status in ('requested','searching')
              and b.captain_user_id is null
              and (b.scheduled_for is null or b.scheduled_for <= now() + interval '30 minutes')
              and (b.women_driver_requested = false or $3 = true)
              and exists (
                select 1
                  from public.kida_captain_locations loc
                 where loc.captain_user_id = $1
                   and loc.updated_at >= now() - interval '90 seconds'
                   and 6371 * 2 * asin(sqrt(least(1.0,
                     power(sin(radians(((b.pickup->>'lat')::double precision - loc.latitude::double precision) / 2)), 2)
                     + cos(radians(loc.latitude::double precision))
                     * cos(radians((b.pickup->>'lat')::double precision))
                     * power(sin(radians(((b.pickup->>'lng')::double precision - loc.longitude::double precision) / 2)), 2)
                   ))) <= $4
              )
              and not exists (
                select 1 from public.kida_bookings active
                 where active.captain_user_id = $1
                   and active.status in ('accepted','captain_arriving','arrived','in_progress')
              )
            order by b.scheduled_for asc nulls first, b.requested_at asc
            limit 30`,
          [context.userId, profile.vehicle_id, profile.is_woman_captain, matchRadiusKm],
        )
      : [];

    const activeRows = await sql.query<BookingCardRow & { customer_name: string | null }>(
      `select b.id::text as id, b.status, b.vehicle_id, b.pickup, b.dropoff, b.stops,
              b.client_fare_preview, b.is_free_ride, b.payment_method,
              b.women_driver_requested, b.scheduled_for::text as scheduled_for,
              b.requested_at::text as requested_at, p.display_name as customer_name
         from public.kida_bookings b
         left join public.kida_profiles p on p.user_id = b.user_id
        where b.captain_user_id = $1
          and b.status in ('accepted','captain_arriving','arrived','in_progress')
        order by b.updated_at desc
        limit 1`,
      [context.userId],
    );
    const statsRows = await sql.query<{ completed_today: number }>(
      `select count(*)::int as completed_today
         from public.kida_bookings
        where captain_user_id = $1
          and status = 'completed'
          and completed_at >= date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata'`,
      [context.userId],
    );

    return {
      hasCaptainRole: true,
      application,
      profile,
      wallet,
      canAcceptRides,
      availableBookings,
      activeBooking: activeRows[0] ?? null,
      completedToday: statsRows[0]?.completed_today ?? 0,
    };
  });

async function getCaptainDailyOnlineMinutes(sql: Awaited<ReturnType<typeof getSql>>, userId: string): Promise<number> {
  const rows = await sql.query<{ used_minutes: number }>(`
    with bounds as (
      select
        (date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata') as day_start,
        ((date_trunc('day', now() at time zone 'Asia/Kolkata') + interval '1 day') at time zone 'Asia/Kolkata') as day_end
    )
    select coalesce(sum(case when s.id is null then 0 else greatest(0, extract(epoch from (
      least(coalesce(s.ended_at,now()), b.day_end) - greatest(s.started_at,b.day_start)
    )) / 60) end),0)::int as used_minutes
    from bounds b
    left join public.kida_captain_work_sessions s
      on s.captain_user_id=$1 and s.started_at < b.day_end and coalesce(s.ended_at,now()) > b.day_start
  `, [userId]);
  return rows[0]?.used_minutes ?? 0;
}

/** Turn availability on only after admin approval and the required ledger balance are configured. */
export const setCaptainAvailability = createServerFn({ method: "POST" })
  .validator((input: unknown) => onlineSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.isOnline) {
      const usedMinutes = await getCaptainDailyOnlineMinutes(sql, context.userId);
      if (usedMinutes >= 480) throw new Error("You have reached the 8-hour online-time limit for today. You can go online again after the next India-time day begins.");
      const eligibility = await sql.query<{ can_accept_rides: boolean; approval_status: string }>(
        `select c.approval_status,
                public.kida_captain_can_accept_rides($1) as can_accept_rides
           from public.kida_captain_profiles c
           join public.kida_user_roles r
             on r.user_id = c.captain_user_id and r.role = 'captain'
          where c.captain_user_id = $1 limit 1`,
        [context.userId],
      );
      if (!eligibility[0] || eligibility[0].approval_status !== "approved") {
        throw new Error("Your Kida Captain profile must be approved before going online.");
      }
      if (!eligibility[0].can_accept_rides) {
        throw new Error("Your Captain wallet is not enabled yet. Kida operations must configure the approved opening balance before you can accept trips.");
      }
    } else {
      const active = await sql.query<{ id: string }>(
        `select id::text as id from public.kida_bookings
          where captain_user_id = $1 and status in ('accepted','captain_arriving','arrived','in_progress')
          limit 1`,
        [context.userId],
      );
      if (active[0]) throw new Error("Finish or contact Kida operations about your active trip before going offline.");
    }

    const rows = await sql.query<{ is_online: boolean }>(
      `update public.kida_captain_profiles
          set is_online = $2, updated_at = now()
        where captain_user_id = $1 and approval_status = 'approved'
        returning is_online`,
      [context.userId, data.isOnline],
    );
    if (!rows[0]) throw new Error("Captain profile not found or not approved.");
    if (data.isOnline) {
      await sql.query("insert into public.kida_captain_work_sessions (captain_user_id) values ($1) on conflict (captain_user_id) where ended_at is null do nothing", [context.userId]);
    } else {
      await sql.query("update public.kida_captain_work_sessions set ended_at=now() where captain_user_id=$1 and ended_at is null", [context.userId]);
    }
    return rows[0];
  });

/** Accept one matching customer booking atomically; a booking can be won by only one Captain. */
export const acceptCaptainBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => acceptSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const captain = await requireCaptain(sql, context.userId);
    if (!captain.is_online) throw new Error("Go online before accepting a trip.");
    if (await getCaptainDailyOnlineMinutes(sql, context.userId) >= 480) {
      await sql.query("update public.kida_captain_profiles set is_online=false,updated_at=now() where captain_user_id=$1", [context.userId]);
      await sql.query("update public.kida_captain_work_sessions set ended_at=now() where captain_user_id=$1 and ended_at is null", [context.userId]);
      throw new Error("The 8-hour online-time limit has been reached. You have been taken offline for today.");
    }
    const matchRadiusKm = captainMatchRadiusKm();
    const rows = await sql.query<{
      id: string;
      from_status: BookingStatus;
      to_status: BookingStatus;
    }>(
      `with eligible as materialized (
         select b.id, b.status
           from public.kida_bookings b
           join public.kida_captain_profiles c
             on c.captain_user_id = $2
          where b.id = $1::uuid
            and b.service_mode = 'ride'
            and b.vehicle_id = c.vehicle_id
            and b.status in ('requested','searching')
            and b.captain_user_id is null
            and c.is_online = true
            and c.approval_status = 'approved'
            and (b.scheduled_for is null or b.scheduled_for <= now() + interval '30 minutes')
            and (b.women_driver_requested = false or c.is_woman_captain = true)
            and public.kida_captain_can_accept_rides($2) = true
            and exists (
              select 1
                from public.kida_captain_locations loc
               where loc.captain_user_id = $2
                 and loc.updated_at >= now() - interval '90 seconds'
                 and 6371 * 2 * asin(sqrt(least(1.0,
                   power(sin(radians(((b.pickup->>'lat')::double precision - loc.latitude::double precision) / 2)), 2)
                   + cos(radians(loc.latitude::double precision))
                   * cos(radians((b.pickup->>'lat')::double precision))
                   * power(sin(radians(((b.pickup->>'lng')::double precision - loc.longitude::double precision) / 2)), 2)
                 ))) <= $3
            )
            and not exists (
              select 1 from public.kida_bookings active
               where active.captain_user_id = $2
                 and active.status in ('accepted','captain_arriving','arrived','in_progress')
            )
          for update of b
       ),
       changed as (
         update public.kida_bookings b
            set captain_user_id = $2,
                status = 'accepted',
                updated_at = now()
           from eligible e
          where b.id = e.id
            and b.status = e.status
            and b.captain_user_id is null
         returning b.id, e.status as from_status, b.status as to_status
       ),
       audit as (
         insert into public.kida_booking_events
           (booking_id, actor_user_id, event_type, from_status, to_status, metadata)
         select id, $2, 'captain_accepted', from_status, to_status,
                jsonb_build_object('source','captain_app')
           from changed
         returning booking_id
       )
       select id::text as id, from_status, to_status from changed`,
      [data.bookingId, context.userId, matchRadiusKm],
    );
    if (!rows[0]) throw new Error("This request is no longer available, outside your matching area, does not match your vehicle, or your Captain account is not eligible.");
    return rows[0];
  });

/** Advance the assigned ride. Starting the trip requires the customer PIN. */
export const advanceCaptainBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => transitionSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireCaptain(sql, context.userId);

    if (data.toStatus === "in_progress") {
      const pins = await sql.query<{ trip_pin_hash: string | null; status: BookingStatus }>(
        `select trip_pin_hash, status
           from public.kida_bookings
          where id = $1::uuid and captain_user_id = $2
          limit 1`,
        [data.bookingId, context.userId],
      );
      if (!pins[0] || pins[0].status !== "arrived" || !matchesTripPin(data.bookingId, data.tripPin ?? "", pins[0].trip_pin_hash)) {
        throw new Error("The trip PIN does not match. Ask the customer to show the PIN in their Kida app.");
      }
    }

    const rows = await sql.query<{
      id: string;
      from_status: BookingStatus;
      to_status: BookingStatus;
      updated_at: string;
    }>(
      `with prior as materialized (
         select id, status
           from public.kida_bookings
          where id = $1::uuid
            and captain_user_id = $2
            and status in ('accepted','captain_arriving','arrived','in_progress')
          for update
       ),
       changed as (
         update public.kida_bookings b
            set status = $3,
                cancel_reason = case when $3 = 'cancelled' then $4 else b.cancel_reason end,
                completed_at = case when $3 = 'completed' then now() else b.completed_at end,
                cancelled_at = case when $3 = 'cancelled' then now() else b.cancelled_at end,
                updated_at = now()
           from prior p
          where b.id = p.id
            and b.status = p.status
            and b.captain_user_id = $2
            and (
              (p.status = 'accepted' and $3 in ('captain_arriving','cancelled'))
              or (p.status = 'captain_arriving' and $3 in ('arrived','cancelled'))
              or (p.status = 'arrived' and $3 in ('in_progress','cancelled'))
              or (p.status = 'in_progress' and $3 = 'completed')
            )
          returning b.id, p.status as from_status, b.status as to_status, b.updated_at
       ),
       audit as (
         insert into public.kida_booking_events
           (booking_id, actor_user_id, event_type, from_status, to_status, metadata)
         select id, $2, 'captain_' || $3, from_status, to_status,
                jsonb_build_object('source','captain_app','reason', $4)
           from changed
         returning booking_id
       )
       select id::text as id, from_status, to_status, updated_at::text as updated_at
         from changed`,
      [data.bookingId, context.userId, data.toStatus, data.reason ?? null],
    );
    if (!rows[0]) throw new Error("The trip status changed or this booking is not assigned to your Captain account.");
    const from = rows[0].from_status;
    if (!canTransitionBooking(from, data.toStatus)) {
      throw new Error("That trip status transition is not allowed.");
    }
    if (data.toStatus === "completed" && await getCaptainDailyOnlineMinutes(sql, context.userId) >= 480) {
      await sql.query(
        "update public.kida_captain_profiles set is_online=false,updated_at=now() where captain_user_id=$1",
        [context.userId],
      );
      await sql.query(
        "update public.kida_captain_work_sessions set ended_at=now() where captain_user_id=$1 and ended_at is null",
        [context.userId],
      );
    }
    return rows[0];
  });

/** Save only the latest GPS fix while the Captain is online. */
export const updateCaptainLocation = createServerFn({ method: "POST" })
  .validator((input: unknown) => locationSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (await getCaptainDailyOnlineMinutes(sql, context.userId) >= 480) {
      const activeTrip = await sql.query<{ id: string }>(
        "select id::text as id from public.kida_bookings where captain_user_id=$1 and status in ('accepted','captain_arriving','arrived','in_progress') limit 1",
        [context.userId],
      );
      if (!activeTrip[0]) {
        await sql.query("update public.kida_captain_profiles set is_online=false,updated_at=now() where captain_user_id=$1", [context.userId]);
        await sql.query("update public.kida_captain_work_sessions set ended_at=now() where captain_user_id=$1 and ended_at is null", [context.userId]);
        throw new Error("The 8-hour online-time limit has been reached. You have been taken offline for today.");
      }
      // Keep safety GPS flowing until this active passenger trip is completed.
      // The accept endpoint independently blocks any new trips after the limit.
    }
    const rows = await sql.query<{ updated_at: string }>(
      `insert into public.kida_captain_locations
         (captain_user_id, latitude, longitude, accuracy_m, heading_deg, speed_mps, updated_at)
       select c.captain_user_id, $2, $3, $4, $5, $6, now()
         from public.kida_captain_profiles c
         join public.kida_user_roles r
           on r.user_id = c.captain_user_id and r.role = 'captain'
        where c.captain_user_id = $1
          and c.approval_status = 'approved'
          and c.is_online = true
       on conflict (captain_user_id) do update set
         latitude = excluded.latitude,
         longitude = excluded.longitude,
         accuracy_m = excluded.accuracy_m,
         heading_deg = excluded.heading_deg,
         speed_mps = excluded.speed_mps,
         updated_at = now()
       returning updated_at::text as updated_at`,
      [
        context.userId,
        data.latitude,
        data.longitude,
        data.accuracyM ?? null,
        data.headingDeg ?? null,
        data.speedMps ?? null,
      ],
    );
    if (!rows[0]) throw new Error("Location updates are available only to an approved Captain who is online.");
    return rows[0];
  });

/** Customer-only trip PIN registration. The raw PIN is never stored in the database. */
export const setMyBookingTripPin = createServerFn({ method: "POST" })
  .validator((input: unknown) => pinSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const credentials = createTripPinCredentials(data.bookingId, data.tripPin);
    const rows = await sql.query<{ id: string }>(
      `update public.kida_bookings
          set trip_pin_hash = $3, trip_pin_ciphertext = $4, updated_at = now()
        where id = $1::uuid
          and user_id = $2
          and captain_user_id is null
          and status in ('requested','searching')
          and (trip_pin_hash is null or trip_pin_hash = $3)
        returning id::text as id`,
      [data.bookingId, context.userId, credentials.tripPinHash, credentials.tripPinCiphertext],
    );
    if (!rows[0]) throw new Error("The trip PIN could not be saved for this booking. Please refresh and retry.");
    return { saved: true };
  });

/** Live view for a customer's own bookings, including only the assigned Captain's fresh location. */
export const listMyBookingsWithCaptain = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      trip_pin_ciphertext: string | null;
      client_request_id: string;
      service_mode: string;
      vehicle_id: string;
      status: BookingStatus;
      pickup: JsonObject;
      dropoff: JsonObject;
      stops: JsonObject[];
      scheduled_for: string | null;
      client_fare_preview: JsonObject | null;
      is_free_ride: boolean;
      customer_reward_cycle: number | null;
      payment_method: string;
      women_driver_requested: boolean;
      currency: string;
      cancel_reason: string | null;
      created_at: string;
      updated_at: string;
      captain_user_id: string | null;
      captain_display_name: string | null;
      captain_registration_number: string | null;
      captain_vehicle_id: string | null;
      captain_vehicle_colour: string | null;
      captain_latitude: string | number | null;
      captain_longitude: string | number | null;
      captain_location_updated_at: string | null;
    }>(
      `select b.id::text as id, b.trip_pin_ciphertext,
              b.client_request_id::text as client_request_id,
              b.service_mode, b.vehicle_id, b.status, b.pickup, b.dropoff, b.stops,
              b.scheduled_for::text as scheduled_for, b.client_fare_preview,
              b.is_free_ride, b.customer_reward_cycle, b.payment_method,
              b.women_driver_requested, b.currency, b.cancel_reason,
              b.created_at::text as created_at, b.updated_at::text as updated_at,
              c.captain_user_id,
              p.display_name as captain_display_name,
              c.registration_number as captain_registration_number,
              c.vehicle_id as captain_vehicle_id,
              c.vehicle_colour as captain_vehicle_colour,
              l.latitude::text as captain_latitude,
              l.longitude::text as captain_longitude,
              l.updated_at::text as captain_location_updated_at
         from public.kida_bookings b
         left join public.kida_captain_profiles c
           on c.captain_user_id = b.captain_user_id
          and c.approval_status = 'approved'
         left join public.kida_profiles p on p.user_id = c.captain_user_id
         left join public.kida_captain_locations l
           on l.captain_user_id = c.captain_user_id
          and l.updated_at >= now() - interval '90 seconds'
          and b.status in ('accepted','captain_arriving','arrived','in_progress')
        where b.user_id = $1
        order by b.created_at desc
        limit 100`,
      [context.userId],
    );
    return rows.map(({ trip_pin_ciphertext, ...booking }) => ({
      ...booking,
      trip_pin: decryptTripPin(booking.id, trip_pin_ciphertext),
    }));
  });
