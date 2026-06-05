create type public.offer_category as enum ('devtools', 'food', 'software', 'swag', 'events', 'research');
create type public.offer_friction as enum ('instant', 'quick', 'involved');
create type public.school as enum (
  'ucla',
  'usc',
  'berkeley',
  'stanford',
  'ucsd',
  'uci',
  'ucsb',
  'ucdavis',
  'ucsc',
  'ucr',
  'calpoly',
  'sdsu',
  'sjsu',
  'csulb'
);
create type public.submission_status as enum ('pending', 'approved', 'rejected');
create type public.offer_source as enum ('seed', 'community');
create type public.offer_signal as enum ('works', 'broken', 'expired', 'duplicate', 'scammy');

create table public.offer_submissions (
  id uuid primary key default gen_random_uuid(),
  school public.school not null,
  title text not null check (char_length(title) between 3 and 90),
  description text not null check (char_length(description) between 12 and 260),
  one_liner text not null check (char_length(one_liner) between 8 and 140),
  category public.offer_category not null,
  friction public.offer_friction not null,
  redemption_url text not null check (redemption_url ~* '^https?://'),
  requires_edu_email boolean not null default false,
  expiry_date date,
  expiry_datetime timestamptz,
  submitted_by_email text check (submitted_by_email is null or submitted_by_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source_note text not null check (char_length(source_note) between 3 and 500),
  status public.submission_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.offer_signals (
  id uuid primary key default gen_random_uuid(),
  offer_id text not null,
  offer_source public.offer_source not null,
  school public.school not null,
  signal public.offer_signal not null,
  voter_fingerprint text,
  signal_day date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value text not null
);

create index offer_submissions_status_created_idx on public.offer_submissions (status, created_at);
create index offer_signals_offer_idx on public.offer_signals (offer_source, offer_id, created_at desc);
create unique index offer_signals_one_per_voter_per_day_idx
  on public.offer_signals (offer_source, offer_id, voter_fingerprint, signal, signal_day)
  where voter_fingerprint is not null;

alter table public.offer_submissions enable row level security;
alter table public.offer_signals enable row level security;
alter table public.app_settings enable row level security;

create or replace function public.has_moderation_token()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(current_setting('request.headers', true)::jsonb ->> 'x-moderation-token', '') =
    coalesce((select value from public.app_settings where key = 'moderation_token'), '');
$$;

grant execute on function public.has_moderation_token() to anon, authenticated;

create policy "Public can submit pending offers"
  on public.offer_submissions
  for insert
  with check (status = 'pending' and reviewed_at is null);

create policy "Public can read approved offers"
  on public.offer_submissions
  for select
  using (
    status = 'approved'
    or public.has_moderation_token()
  );

create policy "Moderators can review submissions"
  on public.offer_submissions
  for update
  using (public.has_moderation_token())
  with check (public.has_moderation_token());

create policy "Public can add offer signals"
  on public.offer_signals
  for insert
  with check (true);

create policy "Public can read offer signals"
  on public.offer_signals
  for select
  using (true);

-- Set this after choosing the same value used by NEXT_PUBLIC_MODERATION_TOKEN.
-- insert into public.app_settings (key, value)
-- values ('moderation_token', 'replace-me')
-- on conflict (key) do update set value = excluded.value;
