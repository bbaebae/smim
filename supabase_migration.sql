-- user_subscriptions 테이블 (Stripe 구독 관리)
create table if not exists public.user_subscriptions (
  user_id uuid references auth.users(id) on delete cascade primary key,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free',   -- free | pro | annual
  status text not null default 'active', -- active | cancelled | past_due
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_subscriptions_updated_at on public.user_subscriptions;
create trigger user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row execute function public.set_updated_at();
