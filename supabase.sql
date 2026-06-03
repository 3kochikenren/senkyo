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
  role_type text not null default '使用者' check (role_type in ('管理者', '使用者')),
  name text not null,
  address text not null,
  mobile text not null,
  email text not null,
  line_id text not null
);

alter table public.members
  add column if not exists role_type text not null default '使用者',
  add column if not exists photo_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'members_role_type_check'
  ) then
    alter table public.members
      add constraint members_role_type_check
      check (role_type in ('管理者', '使用者'));
  end if;
end
$$;

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

alter table public.election_candidates
  add column if not exists activity_start_date date,
  add column if not exists official_approval_date date,
  add column if not exists population integer check (population >= 0),
  add column if not exists households integer check (households >= 0),
  add column if not exists posting_target integer check (posting_target >= 0),
  add column if not exists greeting_target integer check (greeting_target >= 0),
  add column if not exists street_standing_target integer check (street_standing_target >= 0),
  add column if not exists double_poster_target integer check (double_poster_target >= 0),
  add column if not exists street_speech_hours_target numeric(8, 1) check (street_speech_hours_target >= 0);

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

drop policy if exists "Allow public update election candidates" on public.election_candidates;
create policy "Allow public update election candidates" on public.election_candidates
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete election candidates" on public.election_candidates;
create policy "Allow public delete election candidates" on public.election_candidates
  for delete
  to anon
  using (true);

create table if not exists public.posting_counts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  district_name text not null,
  candidate_name text not null,
  activity_date date not null,
  count integer not null check (count >= 0)
);

alter table public.posting_counts
  add column if not exists posting_member_id bigint;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posting_counts_posting_member_id_fkey'
  ) then
    alter table public.posting_counts
      add constraint posting_counts_posting_member_id_fkey
      foreign key (posting_member_id)
      references public.members (id)
      on delete restrict;
  end if;
end
$$;

alter table public.posting_counts enable row level security;

drop policy if exists "Allow public insert posting counts" on public.posting_counts;
create policy "Allow public insert posting counts" on public.posting_counts
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select posting counts" on public.posting_counts;
create policy "Allow public select posting counts" on public.posting_counts
  for select
  to anon
  using (true);

drop policy if exists "Allow public update posting counts" on public.posting_counts;
create policy "Allow public update posting counts" on public.posting_counts
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete posting counts" on public.posting_counts;
create policy "Allow public delete posting counts" on public.posting_counts
  for delete
  to anon
  using (true);

create table if not exists public.campaign_activity_counts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  district_name text not null,
  candidate_name text not null,
  member_id bigint not null references public.members (id) on delete restrict,
  activity_kind text not null check (activity_kind in ('greeting', 'standing', 'doublePoster', 'speech')),
  activity_date date not null,
  count numeric(10, 1) not null check (count >= 0)
);

alter table public.campaign_activity_counts enable row level security;

drop policy if exists "Allow public insert campaign activity counts" on public.campaign_activity_counts;
create policy "Allow public insert campaign activity counts" on public.campaign_activity_counts
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select campaign activity counts" on public.campaign_activity_counts;
create policy "Allow public select campaign activity counts" on public.campaign_activity_counts
  for select
  to anon
  using (true);

drop policy if exists "Allow public update campaign activity counts" on public.campaign_activity_counts;
create policy "Allow public update campaign activity counts" on public.campaign_activity_counts
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete campaign activity counts" on public.campaign_activity_counts;
create policy "Allow public delete campaign activity counts" on public.campaign_activity_counts
  for delete
  to anon
  using (true);

create table if not exists public.supporter_members (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  candidate_id bigint not null references public.election_candidates (id) on delete restrict,
  candidate_name text not null,
  name text not null,
  furigana text,
  postal_code text,
  address text,
  phone text,
  mobile text,
  email text,
  registration_date date not null default current_date
);

create index if not exists supporter_members_candidate_id_idx
  on public.supporter_members (candidate_id);

create index if not exists supporter_members_registration_date_idx
  on public.supporter_members (registration_date);

alter table public.supporter_members enable row level security;

drop policy if exists "Allow public insert supporter members" on public.supporter_members;
create policy "Allow public insert supporter members" on public.supporter_members
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public select supporter members" on public.supporter_members;
create policy "Allow public select supporter members" on public.supporter_members
  for select
  to anon
  using (true);

drop policy if exists "Allow public update supporter members" on public.supporter_members;
create policy "Allow public update supporter members" on public.supporter_members
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Allow public delete supporter members" on public.supporter_members;
create policy "Allow public delete supporter members" on public.supporter_members
  for delete
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