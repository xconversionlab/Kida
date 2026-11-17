import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("Kida V1 migrations create scoped customer records and booking audit rows", async () => {
  const authSql = await readFile(new URL("../migrations/0001_auth.sql", import.meta.url), "utf8");
  const kidaSql = await readFile(new URL("../migrations/0002_kida_core.sql", import.meta.url), "utf8");
  const preferencesSql = await readFile(new URL("../migrations/0003_customer_booking_preferences.sql", import.meta.url), "utf8");
  const commercialSql = await readFile(new URL("../migrations/0004_client_commercial_rules.sql", import.meta.url), "utf8");
  const db = new PGlite();

  try {
    await db.exec(authSql);
    await db.exec(kidaSql);
    await db.exec(preferencesSql);
    await db.exec(commercialSql);

    await db.query(
      `insert into public."user" ("id", "name", "email", "emailVerified")
       values ($1, $2, $3, false)`,
      ["customer-1", "Kida Customer", "customer@example.test"],
    );

    const profile = await db.query(
      "select user_id, display_name, phone_verified_at from public.kida_profiles where user_id = $1",
      ["customer-1"],
    );
    assert.deepEqual(profile.rows[0], {
      user_id: "customer-1",
      display_name: "Kida Customer",
      phone_verified_at: null,
    });

    const roles = await db.query(
      "select role from public.kida_user_roles where user_id = $1",
      ["customer-1"],
    );
    assert.deepEqual(roles.rows, [{ role: "customer" }]);

    const booking = await db.query(
      `insert into public.kida_bookings
         (user_id, client_request_id, vehicle_id, pickup, dropoff)
       values ($1, $2::uuid, 'auto', '{"source":"sample"}'::jsonb,
               '{"source":"sample"}'::jsonb)
       returning id`,
      ["customer-1", "00000000-0000-4000-8000-000000000001"],
    );
    const bookingId = booking.rows[0].id;

    const bookingCommercialDefaults = await db.query(
      "select is_free_ride, customer_reward_cycle, payment_method from public.kida_bookings where id = $1",
      [bookingId],
    );
    assert.deepEqual(bookingCommercialDefaults.rows[0], {
      is_free_ride: false,
      customer_reward_cycle: null,
      payment_method: "cash",
    });

    const settings = await db.query(
      `select platform_commission_percent, captain_share_percent,
              customer_paid_rides_for_free, customer_free_ride_max_km,
              driver_daily_bonus_completed_rides, driver_daily_bonus_amount_paise,
              driver_required_opening_balance_paise, business_timezone
         from public.kida_platform_settings where id = 1`,
    );
    assert.deepEqual(settings.rows[0], {
      platform_commission_percent: 20,
      captain_share_percent: 80,
      customer_paid_rides_for_free: 5,
      customer_free_ride_max_km: "7.00",
      driver_daily_bonus_completed_rides: 15,
      driver_daily_bonus_amount_paise: 20000,
      driver_required_opening_balance_paise: null,
      business_timezone: "Asia/Kolkata",
    });

    assert.deepEqual(
      (await db.query("select public.kida_captain_can_accept_rides($1) as allowed", ["captain-1"])).rows,
      [{ allowed: false }],
      "Captain acceptance must fail closed until a required opening ledger amount is configured",
    );

    await db.query(
      `insert into public."user" ("id", "name", "email", "emailVerified")
       values ($1, $2, $3, false)`,
      ["captain-1", "Kida Captain", "captain@example.test"],
    );
    await db.query(
      "insert into public.kida_user_roles (user_id, role) values ($1, 'captain')",
      ["captain-1"],
    );
    await db.query(
      "insert into public.kida_captain_wallets (captain_user_id, opening_balance_paise, balance_paise) values ($1, 250000, 250000)",
      ["captain-1"],
    );
    await db.query("update public.kida_platform_settings set driver_required_opening_balance_paise = 200000 where id = 1");
    assert.deepEqual(
      (await db.query("select public.kida_captain_can_accept_rides($1) as allowed", ["captain-1"])).rows,
      [{ allowed: true }],
    );

    await db.query(
      `insert into public.kida_booking_events
         (booking_id, actor_user_id, event_type, to_status)
       values ($1, $2, 'booking_requested', 'requested')`,
      [bookingId, "customer-1"],
    );

    const events = await db.query(
      "select event_type, to_status from public.kida_booking_events where booking_id = $1",
      [bookingId],
    );
    assert.deepEqual(events.rows, [{ event_type: "booking_requested", to_status: "requested" }]);

    await db.query(
      "update public.kida_profiles set phone_e164 = $1 where user_id = $2",
      ["+919999999999", "customer-1"],
    );
    await assert.rejects(
      db.query(
        "update public.kida_profiles set phone_e164 = $1 where user_id = $2",
        ["not-a-phone", "customer-1"],
      ),
    );
  } finally {
    await db.close();
  }
});
