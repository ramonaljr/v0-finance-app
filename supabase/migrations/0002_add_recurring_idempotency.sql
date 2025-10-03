-- Add idempotency key to recurring transactions to prevent duplicates
-- This ensures that running the recurring engine multiple times won't create duplicate instances

alter table public.transactions
  add column if not exists recurring_template_id uuid references public.transactions(id) on delete set null,
  add column if not exists idempotency_key text;

-- Create unique index to prevent duplicate recurring instances
-- Format: {template_id}:{YYYY-MM-DD}
create unique index if not exists idx_recurring_idempotency
  on public.transactions (idempotency_key)
  where idempotency_key is not null;

-- Index for finding all instances of a recurring template
create index if not exists idx_recurring_template
  on public.transactions (recurring_template_id)
  where recurring_template_id is not null;

comment on column public.transactions.recurring_template_id is
  'References the original template transaction if this is a recurring instance';

comment on column public.transactions.idempotency_key is
  'Unique key for recurring instances: {template_id}:{date} to prevent duplicates';
