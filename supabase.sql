create table if not exists public.volunteer_applications (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  campaign_id text not null,
  headquarters text not null,
  district text not null,
  election_type text not null,
  name text not null,
  contact text not null,
  skills text[] not null default '{}'::text[],
  days text[] not null default '{}'::text[],
  times text[] not null default '{}'::text[]
);

alter table public.volunteer_applications enable row level security;

drop policy if exists "Allow public insert" on public.volunteer_applications;
create policy "Allow public insert" on public.volunteer_applications
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select" on public.volunteer_applications;
create policy "Allow public select" on public.volunteer_applications
  for select
  to anon
  using (true);

create table if not exists public.members (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  address text not null,
  mobile text not null,
  email text not null,
  line_id text not null
);

alter table public.members
  add column if not exists photo_url text;

alter table public.members enable row level security;

drop policy if exists "Allow public insert members" on public.members;
create policy "Allow public insert members" on public.members
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select members" on public.members;
create policy "Allow public select members" on public.members
  for select
  to anon
  using (true);

drop policy if exists "Allow public update members" on public.members;
create policy "Allow public update members" on public.members
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete members" on public.members;
create policy "Allow public delete members" on public.members
  for delete
  to anon
  using (true);

create table if not exists public.election_district_master (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  district_name text not null,
  notification_date date not null,
  voting_date date not null,
  early_voting text not null,
  seats integer not null check (seats >= 0)
);

alter table public.election_district_master enable row level security;

drop policy if exists "Allow public insert district master" on public.election_district_master;
create policy "Allow public insert district master" on public.election_district_master
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select district master" on public.election_district_master;
create policy "Allow public select district master" on public.election_district_master
  for select
  to anon
  using (true);

drop policy if exists "Allow public update district master" on public.election_district_master;
create policy "Allow public update district master" on public.election_district_master
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete district master" on public.election_district_master;
create policy "Allow public delete district master" on public.election_district_master
  for delete
  to anon
  using (true);

create table if not exists public.election_candidates (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  district_id bigint not null references public.election_district_master (id) on delete restrict,
  member_id bigint not null references public.members (id) on delete restrict
);

create unique index if not exists election_candidates_district_member_unique
  on public.election_candidates (district_id, member_id);

alter table public.election_candidates enable row level security;

drop policy if exists "Allow public insert election candidates" on public.election_candidates;
create policy "Allow public insert election candidates" on public.election_candidates
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select election candidates" on public.election_candidates;
create policy "Allow public select election candidates" on public.election_candidates
  for select
  to anon
  using (true);

insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can upload member photos" on storage.objects;
create policy "Public can upload member photos" on storage.objects
  for insert
  to anon
  with check (bucket_id = 'member-photos');

drop policy if exists "Public can read member photos" on storage.objects;
create policy "Public can read member photos" on storage.objects
  for select
  to anon
  using (bucket_id = 'member-photos');

drop policy if exists "Public can update member photos" on storage.objects;
create policy "Public can update member photos" on storage.objects
  for update
  to anon
  using (bucket_id = 'member-photos')
  with check (bucket_id = 'member-photos');

drop policy if exists "Public can delete member photos" on storage.objects;
create policy "Public can delete member photos" on storage.objects
  for delete
  to anon
  using (bucket_id = 'member-photos');

notify pgrst, 'reload schema';