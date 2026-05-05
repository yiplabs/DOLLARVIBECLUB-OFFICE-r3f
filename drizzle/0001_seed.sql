-- Run this in the Supabase SQL editor AFTER `drizzle-kit migrate`.
-- It wires up:
--   1. auto-creation of a profile row when a new auth.user is inserted
--   2. seeds the 6 themed rooms
--   3. enables RLS + base policies

-- 1. profile auto-create trigger
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, handle, display_name, avatar_config)
  values (
    new.id,
    'user_' || substr(new.id::text, 1, 8),
    coalesce(new.raw_user_meta_data->>'name', 'vibe coder'),
    null
  );
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. seed rooms
insert into public.rooms (slug, name, theme, capacity) values
  ('lounge',     'The Lounge',    'lounge',     50),
  ('deep-focus', 'Deep Focus',    'focus',      30),
  ('the-arena',  'The Arena',     'arena',      30),
  ('brainstorm', 'Brainstorm',    'brainstorm', 30),
  ('the-stage',  'The Stage',     'stage',      80),
  ('mentor-row', 'Mentor Row',    'mentor',     30)
on conflict (slug) do nothing;

-- 3. RLS
alter table profiles      enable row level security;
alter table rooms         enable row level security;
alter table room_presence enable row level security;
alter table projects      enable row level security;

drop policy if exists "profiles_read_all"   on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "rooms_read_all"      on rooms;
drop policy if exists "presence_read_all"   on room_presence;
drop policy if exists "presence_write_own"  on room_presence;
drop policy if exists "projects_read_all"   on projects;
drop policy if exists "projects_write_own"  on projects;

create policy "profiles_read_all"   on profiles      for select using (true);
create policy "profiles_update_own" on profiles      for update using (auth.uid() = id);
create policy "rooms_read_all"      on rooms         for select using (true);
create policy "presence_read_all"   on room_presence for select using (true);
create policy "presence_write_own"  on room_presence for all    using (auth.uid() = user_id);
create policy "projects_read_all"   on projects      for select using (true);
create policy "projects_write_own"  on projects      for all    using (auth.uid() = owner_id);
