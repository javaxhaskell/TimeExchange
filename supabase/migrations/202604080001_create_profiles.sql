create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Initial development/testing policy.
-- Tighten this before shipping any real user data.
create policy "profiles_select_for_initial_testing"
on public.profiles
for select
to anon, authenticated
using (true);
