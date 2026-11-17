import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { BookingStatus } from "./booking-state";

const languageSchema = z.enum(["en", "hi", "ta", "te", "kn", "ml", "bn", "mr", "gu", "pa"]);

const selectionSchema = z.object({
  placeId: z.string().trim().min(1).max(180),
  landmarkId: z.string().trim().max(180).optional().default(""),
  label: z.string().trim().max(180).optional().default(""),
  line: z.string().trim().max(320).optional().default(""),
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  source: z.enum(["saved", "recent", "search", "map", "gps", "operator", "sample", "google"]),
}).strict();

const farePreviewSchema = z.object({
  km: z.number().finite().min(0).max(2000),
  minutes: z.number().int().min(0).max(10000),
  total: z.number().int().min(0).max(1000000),
  regularTotal: z.number().int().min(0).max(1000000).optional(),
  currency: z.literal("INR").default("INR"),
}).strict();

const createBookingSchema = z.object({
  clientRequestId: z.string().uuid(),
  serviceMode: z.enum(["ride", "parcel", "intercity", "rental", "airport", "pet", "transit", "shared"]).default("ride"),
  vehicleId: z.enum(["bike", "auto", "mini", "sedan", "xl"]),
  paymentMethod: z.enum(["upi", "qr", "credit", "debit", "netbanking", "cash"]).default("cash"),
  womenDriverRequested: z.boolean().default(false),
  pickup: selectionSchema,
  dropoff: selectionSchema,
  stops: z.array(selectionSchema).max(3).default([]),
  scheduledFor: z.string().datetime().nullable().optional(),
  farePreview: farePreviewSchema.nullable().optional(),
  customerRewardCode: z.enum(["KIDA_6TH_RIDE_FREE"]).nullable().optional(),
}).strict();

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  phoneE164: z.string().trim().regex(/^\+[1-9][0-9]{7,14}$/).nullable().optional(),
  preferredLanguage: languageSchema.default("en"),
}).strict();

const ticketSchema = z.object({
  bookingId: z.string().uuid().nullable().optional(),
  topic: z.enum(["booking", "payment", "account", "safety", "lost_item", "other"]),
  message: z.string().trim().min(1).max(4000),
}).strict();

const cancelSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().trim().min(1).max(240),
}).strict();

const incidentSchema = z.object({
  bookingId: z.string().uuid().nullable().optional(),
  category: z.enum(["sos", "safety_concern", "accident", "harassment", "other"]),
  description: z.string().trim().max(2000).nullable().optional(),
}).strict();

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type ProfileRow = {
  user_id: string;
  display_name: string;
  phone_e164: string | null;
  phone_verified_at: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

type BookingRow = {
  id: string;
  client_request_id: string;
  service_mode: string;
  vehicle_id: string;
  status: BookingStatus;
  pickup: { [key: string]: JsonValue };
  dropoff: { [key: string]: JsonValue };
  stops: { [key: string]: JsonValue }[];
  scheduled_for: string | null;
  client_fare_preview: { [key: string]: JsonValue } | null;
  is_free_ride: boolean;
  customer_reward_cycle: number | null;
  payment_method: string;
  women_driver_requested: boolean;
  currency: string;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
};

type TicketRow = {
  id: string;
  booking_id: string | null;
  topic: string;
  message: string;
  status: string;
  created_at: string;
};

/**
 * Google Places content is kept minimal: retain the provider place ID only.
 * The customer app already avoids persisting Google names/addresses/geometry;
 * backend snapshots follow the same policy and never store route polylines.
 * For other sources, the booking stores the address/coordinates the customer
 * explicitly submitted with the booking request.
 */
function persistSelection(selection: z.infer<typeof selectionSchema>) {
  if (selection.source === "google") {
    return { source: "google", placeId: selection.placeId };
  }
  return {
    source: selection.source,
    placeId: selection.placeId,
    landmarkId: selection.landmarkId,
    label: selection.label,
    line: selection.line,
    lat: selection.lat,
    lng: selection.lng,
  };
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<ProfileRow>(
      `select user_id, display_name, phone_e164, phone_verified_at::text,
              preferred_language, created_at::text, updated_at::text
         from public.kida_profiles
        where user_id = $1
        limit 1`,
      [context.userId],
    );
    return rows[0] ?? null;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .validator((input: unknown) => profileSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<ProfileRow>(
      `insert into public.kida_profiles
         (user_id, display_name, phone_e164, preferred_language)
       values ($1, $2, $3, $4)
       on conflict (user_id) do update set
         display_name = excluded.display_name,
         phone_verified_at = case
           when public.kida_profiles.phone_e164 is distinct from excluded.phone_e164
             then null
           else public.kida_profiles.phone_verified_at
         end,
         phone_e164 = excluded.phone_e164,
         preferred_language = excluded.preferred_language,
         updated_at = now()
       returning user_id, display_name, phone_e164, phone_verified_at::text,
                 preferred_language, created_at::text, updated_at::text`,
      [
        context.userId,
        data.displayName,
        data.phoneE164 ?? null,
        data.preferredLanguage,
      ],
    );
    return rows[0] ?? null;
  });

export const createMyBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => createBookingSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();

    // Return a prior idempotent request before checking reward eligibility again.
    const existing = await sql.query<Pick<BookingRow, "id" | "client_request_id" | "status" | "created_at" | "is_free_ride">>(
      `select id::text as id, client_request_id::text as client_request_id,
              status, created_at::text as created_at, is_free_ride
         from public.kida_bookings
        where user_id = $1 and client_request_id = $2::uuid
        limit 1`,
      [context.userId, data.clientRequestId],
    );
    if (existing[0]) return existing[0];

    let customerRewardCycle: number | null = null;
    if (data.customerRewardCode === "KIDA_6TH_RIDE_FREE") {
      const eligibleCab = data.vehicleId === "mini" || data.vehicleId === "sedan" || data.vehicleId === "xl";
      if (!eligibleCab) throw new Error("The sixth-ride reward is available for cab categories only.");
      if (!data.farePreview || data.farePreview.km >= 7) {
        throw new Error("The sixth-ride reward applies only to a route below 7 km.");
      }
      const rewardState = await sql.query<{
        paid_completed_since_last_free: number;
        completed_free_rides: number;
        active_free_ride: boolean;
      }>(
        `with last_free as (
           select max(coalesce(completed_at, updated_at)) as completed_at
             from public.kida_bookings
            where user_id = $1 and is_free_ride = true and status = 'completed'
         )
         select
           (select count(*)::int
              from public.kida_bookings b
              cross join last_free lf
             where b.user_id = $1
               and b.status = 'completed'
               and b.is_free_ride = false
               and coalesce((b.client_fare_preview->>'total')::numeric, 0) > 0
               and coalesce(b.completed_at, b.updated_at) > coalesce(lf.completed_at, '-infinity'::timestamptz)
           ) as paid_completed_since_last_free,
           (select count(*)::int
              from public.kida_bookings
             where user_id = $1 and is_free_ride = true and status = 'completed'
           ) as completed_free_rides,
           exists (
             select 1
               from public.kida_bookings
              where user_id = $1
                and is_free_ride = true
                and status in ('requested','searching','accepted','captain_arriving','arrived','in_progress')
           ) as active_free_ride`,
        [context.userId],
      );
      const state = rewardState[0];
      if (!state || state.active_free_ride || state.paid_completed_since_last_free < 5) {
        throw new Error("Complete five paid rides before using the sixth-ride reward.");
      }
      customerRewardCycle = state.completed_free_rides + 1;
    }

    const pickup = JSON.stringify(persistSelection(data.pickup));
    const dropoff = JSON.stringify(persistSelection(data.dropoff));
    const stops = JSON.stringify(data.stops.map(persistSelection));
    const farePreview = data.farePreview ? JSON.stringify(data.farePreview) : null;
    const scheduledFor = data.scheduledFor ?? null;

    // Insert + initial audit event are one SQL statement. A repeated
    // clientRequestId returns the existing row without creating a duplicate.
    const rows = await sql.query<Pick<BookingRow, "id" | "client_request_id" | "status" | "created_at" | "is_free_ride">>(
      `with inserted as (
         insert into public.kida_bookings
           (user_id, client_request_id, service_mode, vehicle_id,
            payment_method, women_driver_requested,
            pickup, dropoff, stops, scheduled_for, client_fare_preview,
            is_free_ride, customer_reward_cycle)
         values ($1, $2::uuid, $3, $4, $5, $6,
                 $7::jsonb, $8::jsonb, $9::jsonb, $10::timestamptz, $11::jsonb,
                 $12, $13)
         on conflict do nothing
         returning id, user_id, client_request_id, status, created_at, is_free_ride
       ),
       audit as (
         insert into public.kida_booking_events
           (booking_id, actor_user_id, event_type, from_status, to_status, metadata)
         select id, user_id, 'booking_requested', null, status,
                jsonb_build_object('source', 'customer_app', 'is_free_ride', is_free_ride)
           from inserted
         returning booking_id
       )
       select id::text as id, client_request_id::text as client_request_id,
              status, created_at::text as created_at, is_free_ride
         from inserted
       union all
       select b.id::text, b.client_request_id::text, b.status, b.created_at::text, b.is_free_ride
         from public.kida_bookings b
        where b.user_id = $1
          and b.client_request_id = $2::uuid
          and not exists (select 1 from inserted)
       limit 1`,
      [
        context.userId,
        data.clientRequestId,
        data.serviceMode,
        data.vehicleId,
        data.paymentMethod,
        data.womenDriverRequested,
        pickup,
        dropoff,
        stops,
        scheduledFor,
        farePreview,
        Boolean(customerRewardCycle),
        customerRewardCycle,
      ],
    );
    if (!rows[0]) throw new Error("Unable to create booking");
    return rows[0];
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql.query<BookingRow>(
      `select id::text as id, client_request_id::text as client_request_id,
              service_mode, vehicle_id, status, pickup, dropoff, stops,
              scheduled_for::text as scheduled_for, client_fare_preview,
              is_free_ride, customer_reward_cycle,
              payment_method, women_driver_requested,
              currency, cancel_reason, created_at::text as created_at,
              updated_at::text as updated_at
         from public.kida_bookings
        where user_id = $1
        order by created_at desc
        limit 100`,
      [context.userId],
    );
  });

export const getMyBooking = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ bookingId: z.string().uuid() }).strict().parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<BookingRow>(
      `select id::text as id, client_request_id::text as client_request_id,
              service_mode, vehicle_id, status, pickup, dropoff, stops,
              scheduled_for::text as scheduled_for, client_fare_preview,
              is_free_ride, customer_reward_cycle,
              currency, cancel_reason, created_at::text as created_at,
              updated_at::text as updated_at
         from public.kida_bookings
        where user_id = $1 and id = $2::uuid
        limit 1`,
      [context.userId, data.bookingId],
    );
    return rows[0] ?? null;
  });

export const getMyBookingEvents = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ bookingId: z.string().uuid() }).strict().parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return sql.query<{
      id: number;
      event_type: string;
      from_status: string | null;
      to_status: string | null;
      metadata: { [key: string]: JsonValue };
      created_at: string;
    }>(
      `select e.id, e.event_type, e.from_status, e.to_status, e.metadata,
              e.created_at::text as created_at
         from public.kida_booking_events e
         join public.kida_bookings b on b.id = e.booking_id
        where b.user_id = $1 and b.id = $2::uuid
        order by e.created_at asc, e.id asc`,
      [context.userId, data.bookingId],
    );
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => cancelSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      from_status: BookingStatus;
      to_status: BookingStatus;
      updated_at: string;
    }>(
      `with locked as materialized (
         select id, status
           from public.kida_bookings
          where id = $1::uuid
            and user_id = $2
            and status in ('requested', 'searching')
          for update
       ),
       changed as (
         update public.kida_bookings b
            set status = 'cancelled',
                cancel_reason = $3,
                cancelled_at = now(),
                updated_at = now()
           from locked l
          where b.id = l.id
         returning b.id, b.status, b.updated_at
       ),
       audit as (
         insert into public.kida_booking_events
           (booking_id, actor_user_id, event_type, from_status, to_status, metadata)
         select c.id, $2, 'booking_cancelled', l.status, c.status,
                jsonb_build_object('reason', $3)
           from changed c
           join locked l on l.id = c.id
         returning booking_id
       )
       select c.id::text as id, l.status as from_status,
              c.status as to_status, c.updated_at::text as updated_at
         from changed c
         join locked l on l.id = c.id`,
      [data.bookingId, context.userId, data.reason],
    );
    return rows[0] ?? null;
  });

export const createMySupportTicket = createServerFn({ method: "POST" })
  .validator((input: unknown) => ticketSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<TicketRow>(
      `insert into public.kida_support_tickets
         (user_id, booking_id, topic, message)
       select $1, $2::uuid, $3, $4
        where $2::uuid is null
           or exists (
             select 1 from public.kida_bookings
              where id = $2::uuid and user_id = $1
           )
       returning id::text as id, booking_id::text as booking_id,
                 topic, message, status, created_at::text as created_at`,
      [context.userId, data.bookingId ?? null, data.topic, data.message],
    );
    if (!rows[0]) throw new Error("Booking not found for this account");
    return rows[0];
  });

export const createMySafetyIncident = createServerFn({ method: "POST" })
  .validator((input: unknown) => incidentSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      booking_id: string | null;
      category: string;
      status: string;
      reported_at: string;
    }>(
      `insert into public.kida_safety_incidents
         (user_id, booking_id, category, description)
       select $1, $2::uuid, $3, $4
        where $2::uuid is null
           or exists (
             select 1 from public.kida_bookings
              where id = $2::uuid and user_id = $1
           )
       returning id::text as id, booking_id::text as booking_id,
                 category, status, reported_at::text as reported_at`,
      [context.userId, data.bookingId ?? null, data.category, data.description ?? null],
    );
    if (!rows[0]) throw new Error("Booking not found for this account");
    // This only records an incident. It does not contact emergency services
    // or a staffed response team.
    return rows[0];
  });

export const listMySupportTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql.query<TicketRow>(
      `select id::text as id, booking_id::text as booking_id,
              topic, message, status, created_at::text as created_at
         from public.kida_support_tickets
        where user_id = $1
        order by created_at desc
        limit 100`,
      [context.userId],
    );
  });
