-- Kida Backend V1
-- Account-backed customer profiles, bookings, status audit events,
-- and support/safety intake. Dispatch, payments and Captain tools are not
-- enabled by this schema.

create table if not exists public.kida_profiles (
  user_id text primary key references public."user" ("id") on delete cascade,
  display_name text not null default '',
  phone_e164 text,
  phone_verified_at timestamptz,
  preferred_language text not null default 'en'
    check (preferred_language in ('en','hi','ta','te','kn','ml','bn','mr','gu','pa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kida_profiles_phone_format check (
    phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{7,14}$'
  )
);

create unique index if not exists kida_profiles_verified_phone_uidx
  on public.kida_profiles (phone_e164)
  where phone_verified_at is not null and phone_e164 is not null;

create table if not exists public.kida_user_roles (
  user_id text not null references public."user" ("id") on delete cascade,
  role text not null check (role in ('customer','captain','admin','support')),
  created_at timestamptz not null default now(),
  created_by text references public."user" ("id") on delete set null,
  primary key (user_id, role)
);

-- New Better Auth accounts receive a customer profile and the least-privilege
-- customer role. No client API is provided to assign elevated roles.
create or replace function public.kida_on_user_created()
returns trigger
language plpgsql
as $$
begin
  insert into public.kida_profiles (user_id, display_name)
  values (new."id", coalesce(new."name", ''))
  on conflict (user_id) do nothing;

  insert into public.kida_user_roles (user_id, role)
  values (new."id", 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

drop trigger if exists kida_user_created on public."user";
create trigger kida_user_created
after insert on public."user"
for each row execute function public.kida_on_user_created();

-- Backfill users created before this migration was deployed.
insert into public.kida_profiles (user_id, display_name)
select "id", coalesce("name", '') from public."user"
on conflict (user_id) do nothing;

insert into public.kida_user_roles (user_id, role)
select "id", 'customer' from public."user"
on conflict (user_id, role) do nothing;

create table if not exists public.kida_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public."user" ("id") on delete restrict,
  client_request_id uuid not null,
  service_mode text not null default 'ride'
    check (service_mode in ('ride','parcel','intercity','rental','airport','pet','transit','shared')),
  vehicle_id text not null check (vehicle_id in ('bike','auto','mini','sedan','xl')),
  status text not null default 'requested'
    check (status in (
      'requested','searching','accepted','captain_arriving','arrived',
      'in_progress','completed','cancelled','expired','no_captain'
    )),
  pickup jsonb not null,
  dropoff jsonb not null,
  stops jsonb not null default '[]'::jsonb,
  scheduled_for timestamptz,
  -- Client-supplied fare display is a preview only. It is never a charge,
  -- settlement instruction, or authoritative server quote.
  client_fare_preview jsonb,
  currency char(3) not null default 'INR',
  cancel_reason text,
  requested_at timestamptz not null default now(),
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id),
  constraint kida_bookings_stops_array check (jsonb_typeof(stops) = 'array'),
  constraint kida_bookings_pickup_object check (jsonb_typeof(pickup) = 'object'),
  constraint kida_bookings_dropoff_object check (jsonb_typeof(dropoff) = 'object')
);

create index if not exists kida_bookings_user_created_idx
  on public.kida_bookings (user_id, created_at desc);
create index if not exists kida_bookings_status_created_idx
  on public.kida_bookings (status, created_at);

create table if not exists public.kida_booking_events (
  id bigint generated always as identity primary key,
  booking_id uuid not null references public.kida_bookings (id) on delete restrict,
  actor_user_id text references public."user" ("id") on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists kida_booking_events_booking_created_idx
  on public.kida_booking_events (booking_id, created_at);

create table if not exists public.kida_support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public."user" ("id") on delete restrict,
  booking_id uuid references public.kida_bookings (id) on delete restrict,
  topic text not null check (topic in ('booking','payment','account','safety','lost_item','other')),
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'open' check (status in ('open','in_review','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kida_support_tickets_user_created_idx
  on public.kida_support_tickets (user_id, created_at desc);

create table if not exists public.kida_safety_incidents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public."user" ("id") on delete restrict,
  booking_id uuid references public.kida_bookings (id) on delete restrict,
  category text not null check (category in ('sos','safety_concern','accident','harassment','other')),
  description text,
  status text not null default 'received' check (status in ('received','in_review','resolved','closed')),
  reported_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kida_safety_incidents_user_reported_idx
  on public.kida_safety_incidents (user_id, reported_at desc);
