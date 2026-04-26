-- contents 테이블
create table contents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  type          text not null check (type in ('article','youtube','instagram','text','file')),
  url           text,
  title         text not null,
  full_text     text not null,
  summary       text not null,
  category      text not null,
  tags          text[] default '{}',
  thumbnail_url text,
  created_at    timestamptz default now()
);

-- review_schedule 테이블
create table review_schedule (
  id             uuid primary key default gen_random_uuid(),
  content_id     uuid references contents(id) on delete cascade,
  user_id        uuid references auth.users not null,
  next_review_at date not null default current_date + 1,
  interval_days  int not null default 1,
  ease_factor    numeric not null default 2.5,
  review_count   int not null default 0
);

-- email_logs 테이블
create table email_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  sent_at     timestamptz default now(),
  content_ids uuid[] not null
);

-- subscriptions 테이블
create table subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users not null unique,
  plan                text not null default 'free',
  status              text not null default 'active',
  current_period_end  timestamptz,
  created_at          timestamptz default now()
);

-- RLS 활성화
alter table contents enable row level security;
alter table review_schedule enable row level security;
alter table email_logs enable row level security;
alter table subscriptions enable row level security;

create policy "본인 데이터만" on contents
  for all using (auth.uid() = user_id);

create policy "본인 데이터만" on review_schedule
  for all using (auth.uid() = user_id);

create policy "본인 데이터만" on email_logs
  for all using (auth.uid() = user_id);

create policy "본인 데이터만" on subscriptions
  for all using (auth.uid() = user_id);
