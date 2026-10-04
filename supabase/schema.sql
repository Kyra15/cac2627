-- run in supabase dashboard > sql editor. safe to re-run.

create extension if not exists pgcrypto;

-- reports

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default 'untitled report',
  image_paths text[] not null default '{}',
  summary text,
  key_insights jsonb not null default '[]'::jsonb,
  doctor_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.report_markers (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  value text,
  unit text,
  ref_range text,
  flag text not null default 'unknown' check (flag in ('low', 'normal', 'high', 'unknown')),
  position int not null default 0
);

-- chat

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  report_id uuid references public.reports (id) on delete set null,
  title text not null default 'new chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_idx on public.reports (user_id, created_at desc);
create index if not exists report_markers_report_idx on public.report_markers (report_id);
create index if not exists report_markers_user_idx on public.report_markers (user_id);
create index if not exists chat_sessions_user_idx on public.chat_sessions (user_id, updated_at desc);
create index if not exists chat_messages_session_idx on public.chat_messages (session_id, created_at);
create index if not exists chat_messages_user_idx on public.chat_messages (user_id);

-- row level security

alter table public.reports enable row level security;
alter table public.report_markers enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "own reports" on public.reports;
create policy "own reports" on public.reports
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- child rows must also point at a parent the user owns
drop policy if exists "own markers" on public.report_markers;
create policy "own markers" on public.report_markers
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.reports r
      where r.id = report_id and r.user_id = (select auth.uid())
    )
  );

drop policy if exists "own sessions" on public.chat_sessions;
create policy "own sessions" on public.chat_sessions
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      report_id is null
      or exists (
        select 1 from public.reports r
        where r.id = report_id and r.user_id = (select auth.uid())
      )
    )
  );

drop policy if exists "own messages" on public.chat_messages;
create policy "own messages" on public.chat_messages
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.chat_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

-- storage: private bucket, files live under <user id>/...

insert into storage.buckets (id, name, public)
values ('reports', 'reports', false)
on conflict (id) do update set public = false;

drop policy if exists "own report files" on storage.objects;
create policy "own report files" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'reports'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'reports'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
