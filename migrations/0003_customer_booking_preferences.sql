-- Persist customer-selected booking preferences with the booking request.
-- These values record intent only; they do not create a payment or guarantee
-- a woman Captain will be available.

alter table public.kida_bookings
  add column if not exists payment_method text not null default 'cash'
    check (payment_method in ('upi','qr','credit','debit','netbanking','cash'));

alter table public.kida_bookings
  add column if not exists women_driver_requested boolean not null default false;
