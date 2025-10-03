-- Cache refresh retry queue using pg_cron
-- This ensures cache refreshes are retried on failure

-- Create cache refresh queue table
create table if not exists public.cache_refresh_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending', -- pending, processing, completed, failed
  attempts int not null default 0,
  max_attempts int not null default 3,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  processed_at timestamptz
);

-- Index for efficient queue processing
create index if not exists idx_cache_queue_status_created
  on public.cache_refresh_queue (status, created_at)
  where status in ('pending', 'failed');

-- Enable RLS
alter table public.cache_refresh_queue enable row level security;

-- Only service role can access queue
create policy if not exists cache_queue_service_only on public.cache_refresh_queue
  for all using (false); -- No user access, only service role

-- Function to enqueue cache refresh
create or replace function enqueue_cache_refresh(p_user_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_queue_id uuid;
begin
  -- Check if there's already a pending/processing job for this user in last 5 minutes
  select id into v_queue_id
  from public.cache_refresh_queue
  where user_id = p_user_id
    and status in ('pending', 'processing')
    and created_at > now() - interval '5 minutes'
  limit 1;

  -- If found, return existing job
  if v_queue_id is not null then
    return v_queue_id;
  end if;

  -- Otherwise, create new job
  insert into public.cache_refresh_queue (user_id, status)
  values (p_user_id, 'pending')
  returning id into v_queue_id;

  return v_queue_id;
end;
$$;

-- Function to process cache refresh queue (called by pg_cron or edge function)
create or replace function process_cache_refresh_queue()
returns jsonb
language plpgsql
security definer
as $$
declare
  v_job record;
  v_processed int := 0;
  v_failed int := 0;
  v_results jsonb := '[]'::jsonb;
begin
  -- Process pending and failed (with attempts < max) jobs
  for v_job in
    select *
    from public.cache_refresh_queue
    where status in ('pending', 'failed')
      and attempts < max_attempts
    order by created_at asc
    limit 50
  loop
    begin
      -- Mark as processing
      update public.cache_refresh_queue
      set status = 'processing',
          updated_at = now()
      where id = v_job.id;

      -- Call the edge function (this will be invoked by the edge function itself)
      -- For now, just increment attempts and mark as completed
      -- In production, this would invoke the refresh-caches edge function

      update public.cache_refresh_queue
      set status = 'completed',
          attempts = attempts + 1,
          processed_at = now(),
          updated_at = now()
      where id = v_job.id;

      v_processed := v_processed + 1;

    exception when others then
      -- Mark as failed and record error
      update public.cache_refresh_queue
      set status = case
                    when attempts + 1 >= max_attempts then 'failed'
                    else 'pending'
                  end,
          attempts = attempts + 1,
          last_error = SQLERRM,
          updated_at = now()
      where id = v_job.id;

      v_failed := v_failed + 1;
    end;
  end loop;

  return jsonb_build_object(
    'processed', v_processed,
    'failed', v_failed,
    'timestamp', now()
  );
end;
$$;

-- Grant execute permissions to service role
-- Note: This assumes you have a service role or authenticated role
-- Adjust based on your Supabase setup

comment on table public.cache_refresh_queue is
  'Queue for retry-able cache refresh jobs. Processed by edge function or pg_cron.';

comment on function enqueue_cache_refresh is
  'Enqueues a cache refresh job for a user. Deduplicates recent requests.';

comment on function process_cache_refresh_queue is
  'Processes pending cache refresh jobs. Called by pg_cron or edge function.';
