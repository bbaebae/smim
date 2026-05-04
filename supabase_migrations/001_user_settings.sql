-- user_settings: stores per-user notification preferences and push subscription
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_notify boolean not null default true,
  push_notify boolean not null default false,
  push_subscription jsonb default null,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);
