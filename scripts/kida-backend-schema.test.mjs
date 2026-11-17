import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("Kida V1 migrations create scoped customer records and booking audit rows", async () => {
  const authSql = await readFile(new URL("../migrations/0001_auth.sql", import.meta.url), "utf8");
  const kidaSql = await readFile(new URL("../migrations/0002_kida_core.sql", import.meta.url), "utf8");
  const db = new PGlite();

  try {
    await db.exec(authSql);
    await db.exec(kidaSql);

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

    await assert.rejects(
      db.query(
        `insert into public.kida_profiles (user_id, phone_e164)
         values ($1, $2)`,
        ["customer-1", "not-a-phone"],
      ),
    );
  } finally {
    await db.close();
  }
});
