-- Schema: Core tables, indexes, and RLS policies
-- Assumes Supabase with auth schema providing auth.uid()

create table if not exists public.users (
  id uuid primary key,
  email text not null,
  country text,
  currency_code text default 'USD',
  ai_consent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  type text not null,
  currency_code text not null default 'USD',
  balance_minor bigint not null default 0,
  synced_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  icon text,
  color text,
  created_at timestamptz default now()
);

create type direction as enum ('in','out');

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  amount_minor bigint not null,
  currency_code text not null,
  direction direction not null,
  occurred_at timestamptz not null,
  payee text,
  notes text,
  tags jsonb default '[]'::jsonb,
  is_recurring boolean default false,
  recur_rule text,
  attachment_url text,
  is_reconciled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create type budget_type as enum ('zero','cap','envelope');

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  period_month int not null,
  period_year int not null,
  type budget_type not null default 'zero',
  rollover boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  limit_minor bigint not null,
  rollover_from_prev_minor bigint not null default 0,
  allocated_minor bigint not null default 0,
  notes text
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  severity text,
  kpi jsonb,
  source_span jsonb,
  created_at timestamptz default now(),
  dismissed_at timestamptz
);

create table if not exists public.kpi_cache (
  user_id uuid not null references public.users(id) on delete cascade,
  period_month int not null,
  period_year int not null,
  income_minor bigint not null default 0,
  expense_minor bigint not null default 0,
  net_minor bigint not null default 0,
  top_cats jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, period_month, period_year)
);

create table if not exists public.calendar_cache (
  user_id uuid not null references public.users(id) on delete cascade,
  y int not null,
  m int not null,
  days jsonb not null,
  updated_at timestamptz default now(),
  primary key (user_id, y, m)
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null,
  prompt_hash text,
  prompt_redacted text,
  response_redacted text,
  token_usage jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_tx_user_occurred on public.transactions (user_id, occurred_at);
create index if not exists idx_tx_user_cat_occurred on public.transactions (user_id, category_id, occurred_at);
create index if not exists idx_budget_user_period on public.budgets (user_id, period_year, period_month);

-- RLS
alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_items enable row level security;
alter table public.insights enable row level security;
alter table public.kpi_cache enable row level security;
alter table public.calendar_cache enable row level security;
alter table public.ai_logs enable row level security;

create policy if not exists users_self on public.users
  for select using (id = auth.uid());

create policy if not exists accounts_own on public.accounts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists categories_own on public.categories
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists transactions_own on public.transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists budgets_own on public.budgets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists budget_items_by_budget on public.budget_items
  for all using (
    exists (
      select 1 from public.budgets b
      where b.id = budget_id and b.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.budgets b
      where b.id = budget_id and b.user_id = auth.uid()
    )
  );

create policy if not exists insights_own on public.insights
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists kpi_cache_own on public.kpi_cache
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists calendar_cache_own on public.calendar_cache
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists ai_logs_own on public.ai_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());


