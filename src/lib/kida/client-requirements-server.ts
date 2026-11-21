import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

async function requireAdmin(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql.query<{ role: string }>(
    "select role from public.kida_user_roles where user_id = $1 and role = 'admin' limit 1",
    [userId],
  );
  if (!rows[0]) throw new Error("This Kida account is not authorised for operations administration.");
}

async function requireCaptain(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql.query<{ role: string }>(
    "select role from public.kida_user_roles where user_id = $1 and role = 'captain' limit 1",
    [userId],
  );
  if (!rows[0]) throw new Error("An approved Kida Captain account is required.");
}

const campaignInputSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).default(""),
  startsAt: z.string().datetime().nullable(),
  endsAt: z.string().datetime().nullable(),
  minimumFarePaise: z.number().int().min(0).max(100_000_000),
  rewardType: z.enum(["fixed_discount","percentage_discount","free_ride_cap"]),
  rewardValue: z.number().int().min(1).max(10000),
  maximumDiscountPaise: z.number().int().min(1).max(100_000_000),
  eligibleVehicleIds: z.array(z.enum(["bike","auto","mini","sedan","xl"])).min(1).max(5),
  frequencyMode: z.enum(["every_n","probability"]),
  frequencyN: z.number().int().min(2).max(1000).nullable(),
  probabilityBps: z.number().int().min(1).max(10000).nullable(),
  dailyBudgetPaise: z.number().int().positive().max(1_000_000_000).nullable(),
  weeklyBudgetPaise: z.number().int().positive().max(5_000_000_000).nullable(),
  maxUsesPerCustomer: z.number().int().min(1).max(100),
  firstRideOnly: z.boolean(),
  secondRideOnly: z.boolean(),
  officeStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  officeEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  officeAreaLabel: z.string().trim().max(160).nullable(),
}).strict().superRefine((value, ctx) => {
  if (value.frequencyMode === "every_n" && (value.frequencyN === null || value.probabilityBps !== null)) {
    ctx.addIssue({ code: "custom", path: ["frequencyN"], message: "Every-N campaigns require an interval and no probability." });
  }
  if (value.frequencyMode === "probability" && (value.probabilityBps === null || value.frequencyN !== null)) {
    ctx.addIssue({ code: "custom", path: ["probabilityBps"], message: "Probability campaigns require a percentage and no interval." });
  }
  if (value.firstRideOnly && value.secondRideOnly) {
    ctx.addIssue({ code: "custom", path: ["secondRideOnly"], message: "A campaign cannot target both first and second ride only." });
  }
  if ((value.officeStartTime === null) !== (value.officeEndTime === null)) {
    ctx.addIssue({ code: "custom", path: ["officeEndTime"], message: "Set both office offer start and end time, or neither." });
  }
  if (value.startsAt && value.endsAt && new Date(value.endsAt) <= new Date(value.startsAt)) {
    ctx.addIssue({ code: "custom", path: ["endsAt"], message: "Campaign end must be after its start." });
  }
});

export const listKidaCampaigns = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql.query<{
      id: string; name: string; description: string; status: string;
      starts_at: string | null; ends_at: string | null;
      minimum_fare_paise: string; reward_type: string; reward_value: number;
      maximum_discount_paise: string; eligible_vehicle_ids: string[];
      frequency_mode: string; frequency_n: number | null; probability_bps: number | null;
      daily_budget_paise: string | null; weekly_budget_paise: string | null;
      max_uses_per_customer: number; first_ride_only: boolean; second_ride_only: boolean;
      office_start_time: string | null; office_end_time: string | null; office_area_label: string | null;
      redemptions_today: number; spend_today_paise: string; spend_week_paise: string;
    }>(`
      select c.id::text as id, c.name, c.description, c.status,
             c.starts_at::text as starts_at, c.ends_at::text as ends_at,
             c.minimum_fare_paise::text as minimum_fare_paise,
             c.reward_type, c.reward_value,
             c.maximum_discount_paise::text as maximum_discount_paise,
             c.eligible_vehicle_ids, c.frequency_mode, c.frequency_n, c.probability_bps,
             c.daily_budget_paise::text as daily_budget_paise,
             c.weekly_budget_paise::text as weekly_budget_paise,
             c.max_uses_per_customer, c.first_ride_only, c.second_ride_only,
             c.office_start_time::text as office_start_time,
             c.office_end_time::text as office_end_time, c.office_area_label,
             count(r.id) filter (where r.used_at >= date_trunc('day', now()))::int as redemptions_today,
             coalesce(sum(r.company_funded_paise) filter (where r.used_at >= date_trunc('day', now()) and r.status in ('reserved','completed')),0)::text as spend_today_paise,
             coalesce(sum(r.company_funded_paise) filter (where r.used_at >= date_trunc('week', now()) and r.status in ('reserved','completed')),0)::text as spend_week_paise
        from public.kida_campaigns c
        left join public.kida_campaign_redemptions r on r.campaign_id = c.id
       group by c.id
       order by c.created_at desc
       limit 100
    `);
    return rows;
  });

export const saveKidaCampaign = createServerFn({ method: "POST" })
  .validator((input: unknown) => campaignInputSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const values = [
      data.name, data.description, data.startsAt, data.endsAt,
      data.minimumFarePaise, data.rewardType, data.rewardValue,
      data.maximumDiscountPaise, data.eligibleVehicleIds,
      data.frequencyMode, data.frequencyN, data.probabilityBps,
      data.dailyBudgetPaise, data.weeklyBudgetPaise, data.maxUsesPerCustomer,
      data.firstRideOnly, data.secondRideOnly, data.officeStartTime,
      data.officeEndTime, data.officeAreaLabel, context.userId,
    ];
    const rows = await sql.query<{ id: string }>(`
      with inserted as (
        insert into public.kida_campaigns
          (name, description, status, starts_at, ends_at, minimum_fare_paise,
           reward_type, reward_value, maximum_discount_paise, eligible_vehicle_ids,
           frequency_mode, frequency_n, probability_bps, daily_budget_paise,
           weekly_budget_paise, max_uses_per_customer, first_ride_only, second_ride_only,
           office_start_time, office_end_time, office_area_label, created_by, updated_by)
        values ($1,$2,'draft',$3::timestamptz,$4::timestamptz,$5,
                $6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
                $18::time,$19::time,$20,$21,$21)
        returning id
      ), audit as (
        insert into public.kida_campaign_audit (campaign_id, actor_user_id, action, after_state)
        select id, $21, 'created', jsonb_build_object('name',$1,'status','draft')
          from inserted
        returning campaign_id
      )
      select id::text as id from inserted
    `, values);
    if (!rows[0]) throw new Error("Campaign could not be saved.");
    return rows[0];
  });

const campaignStatusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum(["active","paused","ended"]),
}).strict();

export const setKidaCampaignStatus = createServerFn({ method: "POST" })
  .validator((input: unknown) => campaignStatusSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    if (data.status === "active") {
      const valid = await sql.query<{ valid: boolean }>(`
        select (
          starts_at is not null and ends_at is not null and ends_at > now()
          and minimum_fare_paise >= 0 and maximum_discount_paise > 0
          and (daily_budget_paise is not null or weekly_budget_paise is not null)
        ) as valid
          from public.kida_campaigns where id = $1::uuid and status in ('draft','paused')
      `, [data.campaignId]);
      if (!valid[0]?.valid) {
        throw new Error("Activation requires an approved start/end window, a discount cap, and a daily or weekly spend budget.");
      }
    }
    const rows = await sql.query<{ id: string; status: string }>(`
      with changed as (
        update public.kida_campaigns
           set status = $2, updated_by = $3, updated_at = now()
         where id = $1::uuid and status <> 'ended'
         returning id, status
      ), audit as (
        insert into public.kida_campaign_audit (campaign_id, actor_user_id, action, after_state)
        select id, $3, $2, jsonb_build_object('status',status) from changed
        returning campaign_id
      )
      select id::text as id, status from changed
    `, [data.campaignId, data.status, context.userId]);
    if (!rows[0]) throw new Error("Campaign was not found or is already ended.");
    return rows[0];
  });

export const getKidaCampaignReport = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const totals = await sql.query<{
      redemptions_today: number; redemptions_week: number;
      total_spend_today_paise: string; total_spend_week_paise: string;
      completed_today: number; cancelled_today: number;
    }>(`
      select
        count(*) filter (where r.used_at >= date_trunc('day',now()))::int as redemptions_today,
        count(*) filter (where r.used_at >= date_trunc('week',now()))::int as redemptions_week,
        coalesce(sum(r.company_funded_paise) filter (where r.used_at >= date_trunc('day',now()) and r.status in ('reserved','completed')),0)::text as total_spend_today_paise,
        coalesce(sum(r.company_funded_paise) filter (where r.used_at >= date_trunc('week',now()) and r.status in ('reserved','completed')),0)::text as total_spend_week_paise,
        count(*) filter (where r.status = 'completed' and r.completed_at >= date_trunc('day',now()))::int as completed_today,
        count(*) filter (where r.status = 'cancelled' and r.used_at >= date_trunc('day',now()))::int as cancelled_today
      from public.kida_campaign_redemptions r
    `);
    const areas = await sql.query<{ area_label: string; redemptions: number; spend_paise: string }>(`
      select coalesce(nullif(r.area_label,''),'Area not recorded') as area_label,
             count(*)::int as redemptions,
             coalesce(sum(r.company_funded_paise),0)::text as spend_paise
        from public.kida_campaign_redemptions r
       where r.used_at >= date_trunc('day',now())
       group by 1 order by count(*) desc limit 10
    `);
    const peakHours = await sql.query<{ hour: number; redemptions: number }>(`
      select extract(hour from r.used_at)::int as hour, count(*)::int as redemptions
        from public.kida_campaign_redemptions r
       where r.used_at >= date_trunc('day',now())
       group by 1 order by redemptions desc limit 5
    `);
    return { totals: totals[0] ?? null, areas, peakHours };
  });

const workSummarySchema = z.object({}).strict();
export const getCaptainWorkSummary = createServerFn({ method: "GET" })
  .validator((input: unknown) => workSummarySchema.parse(input ?? {}))
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireCaptain(sql, context.userId);
    const rows = await sql.query<{ used_minutes: number; remaining_minutes: number; session_started_at: string | null }>(`
      with bounds as (
        select
          (date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata') as day_start,
          ((date_trunc('day', now() at time zone 'Asia/Kolkata') + interval '1 day') at time zone 'Asia/Kolkata') as day_end
      )
      select
        coalesce(sum(greatest(0, extract(epoch from (
          least(coalesce(s.ended_at,now()), b.day_end) - greatest(s.started_at,b.day_start)
        )) / 60)),0)::int as used_minutes,
        greatest(0,480 - coalesce(sum(greatest(0, extract(epoch from (
          least(coalesce(s.ended_at,now()), b.day_end) - greatest(s.started_at,b.day_start)
        )) / 60)),0))::int as remaining_minutes,
        max(s.started_at)::text as session_started_at
      from bounds b
      left join public.kida_captain_work_sessions s
        on s.captain_user_id = $1 and s.started_at < b.day_end and coalesce(s.ended_at,now()) > b.day_start
    `, [context.userId]);
    return rows[0] ?? { used_minutes: 0, remaining_minutes: 480, session_started_at: null };
  });

const sosSchema = z.object({
  category: z.enum(["captain_safety","passenger_safety","vehicle_safety","medical","other"]),
  bookingId: z.string().uuid().nullable().optional(),
  latitude: z.number().finite().min(-90).max(90).nullable().optional(),
  longitude: z.number().finite().min(-180).max(180).nullable().optional(),
  note: z.string().trim().max(1000).default(""),
}).strict().superRefine((data, ctx) => {
  if ((data.latitude == null) !== (data.longitude == null)) {
    ctx.addIssue({ code: "custom", path: ["longitude"], message: "Both coordinates must be supplied together." });
  }
});

export const recordCaptainSosAlert = createServerFn({ method: "POST" })
  .validator((input: unknown) => sosSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireCaptain(sql, context.userId);
    if (data.bookingId) {
      const booking = await sql.query<{ id: string }>(
        "select id::text as id from public.kida_bookings where id=$1::uuid and captain_user_id=$2 limit 1",
        [data.bookingId, context.userId],
      );
      if (!booking[0]) throw new Error("This booking is not assigned to your Captain account.");
    }
    const rows = await sql.query<{ id: string; created_at: string }>(`
      insert into public.kida_captain_sos_alerts
        (captain_user_id, booking_id, category, latitude, longitude, note)
      values ($1,$2::uuid,$3,$4,$5,$6)
      returning id::text as id, created_at::text as created_at
    `, [context.userId, data.bookingId ?? null, data.category, data.latitude ?? null, data.longitude ?? null, data.note]);
    if (!rows[0]) throw new Error("SOS record could not be saved.");
    return { ...rows[0], dispatchStatus: "not_dispatched" as const };
  });

const payoutPreferenceSchema = z.object({ schedule: z.enum(["weekly","every_3_days"]) }).strict();
export const saveCaptainPayoutPreference = createServerFn({ method: "POST" })
  .validator((input: unknown) => payoutPreferenceSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireCaptain(sql, context.userId);
    const rows = await sql.query<{ requested_schedule: string }>(`
      insert into public.kida_captain_payout_preferences (captain_user_id, requested_schedule)
      values ($1,$2)
      on conflict (captain_user_id) do update
        set requested_schedule = excluded.requested_schedule, updated_at = now()
      returning requested_schedule
    `, [context.userId, data.schedule]);
    return rows[0];
  });

const shareCreateSchema = z.object({ bookingId: z.string().uuid() }).strict();
export const createLiveTripShare = createServerFn({ method: "POST" })
  .validator((input: unknown) => shareCreateSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const bookings = await sql.query<{ id: string; status: string }>(`
      select id::text as id, status from public.kida_bookings
       where id=$1::uuid and user_id=$2
         and status in ('requested','searching','accepted','captain_arriving','arrived','in_progress')
       limit 1
    `, [data.bookingId, context.userId]);
    if (!bookings[0]) throw new Error("Live sharing is available only for your active Kida booking.");
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await sql.query(`
      update public.kida_trip_shares
         set revoked_at = now()
       where booking_id=$1::uuid and customer_user_id=$2 and revoked_at is null
    `, [data.bookingId, context.userId]);
    const rows = await sql.query<{ expires_at: string }>(`
      insert into public.kida_trip_shares (booking_id, customer_user_id, token_hash, expires_at)
      values ($1::uuid,$2,$3,now()+interval '12 hours')
      returning expires_at::text as expires_at
    `, [data.bookingId, context.userId, tokenHash]);
    return { token, expiresAt: rows[0]?.expires_at ?? null };
  });

const sharedTripSchema = z.object({ token: z.string().min(32).max(128) }).strict();
export const getSharedKidaTrip = createServerFn({ method: "GET" })
  .validator((input: unknown) => sharedTripSchema.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const tokenHash = createHash("sha256").update(data.token).digest("hex");
    const rows = await sql.query<{
      id: string; status: string; pickup: Record<string, unknown>; dropoff: Record<string, unknown>;
      captain_name: string | null; captain_registration_number: string | null;
      captain_latitude: string | null; captain_longitude: string | null;
      captain_location_updated_at: string | null; expires_at: string;
    }>(`
      select b.id::text as id, b.status, b.pickup, b.dropoff,
             u."name" as captain_name, cp.registration_number as captain_registration_number,
             loc.latitude::text as captain_latitude, loc.longitude::text as captain_longitude,
             loc.updated_at::text as captain_location_updated_at, s.expires_at::text as expires_at
        from public.kida_trip_shares s
        join public.kida_bookings b on b.id=s.booking_id
        left join public."user" u on u."id"=b.captain_user_id
        left join public.kida_captain_profiles cp on cp.captain_user_id=b.captain_user_id
        left join public.kida_captain_locations loc
          on loc.captain_user_id=b.captain_user_id and loc.updated_at >= now()-interval '90 seconds'
       where s.token_hash=$1 and s.revoked_at is null and s.expires_at > now()
       limit 1
    `, [tokenHash]);
    if (!rows[0]) throw new Error("This trip link has expired or was revoked.");
    return rows[0];
  });
