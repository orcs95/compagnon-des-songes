create table public.community_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  community text not null check (community in ('discord', 'whatsapp')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users,
  unique (user_id, community)
);

alter table public.community_access_requests enable row level security;

create policy "Users can view own community requests"
on public.community_access_requests
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create community request"
on public.community_access_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy "Admins can view all community requests"
on public.community_access_requests
for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Admins can update community requests"
on public.community_access_requests
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (true);
