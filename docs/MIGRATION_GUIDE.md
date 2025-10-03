# Database Migration Guide

## Overview
This guide covers applying the Week 1-2 Sprint database migrations to your Supabase instance.

## Prerequisites
- Supabase project with admin access
- Database migrations in `supabase/migrations/`

## Migration Files

### 0002_add_recurring_idempotency.sql
**Purpose**: Prevent duplicate recurring transactions via idempotency keys

**Changes**:
- Adds `recurring_template_id` column (references template transaction)
- Adds `idempotency_key` column (format: `{template_id}:{YYYY-MM-DD}`)
- Creates unique index on `idempotency_key`
- Creates index on `recurring_template_id`

### 0003_add_cache_refresh_queue.sql
**Purpose**: Implement retry queue for cache refresh operations

**Changes**:
- Creates `cache_refresh_queue` table
- Adds `enqueue_cache_refresh(user_id)` function
- Adds `process_cache_refresh_queue()` function
- Sets up RLS policies

---

## Option 1: Supabase Dashboard (Recommended)

### Step 1: Navigate to SQL Editor
1. Go to https://supabase.com/dashboard/project/[your-project-id]
2. Click **SQL Editor** in left sidebar
3. Click **New query**

### Step 2: Apply Migration 0002
1. Copy contents of `supabase/migrations/0002_add_recurring_idempotency.sql`
2. Paste into SQL editor
3. Click **Run** (or press Ctrl+Enter)
4. Verify success message: "Success. No rows returned"

### Step 3: Apply Migration 0003
1. Click **New query**
2. Copy contents of `supabase/migrations/0003_add_cache_refresh_queue.sql`
3. Paste into SQL editor
4. Click **Run**
5. Verify success message

### Step 4: Verify Migrations
Run this query to verify new columns exist:
```sql
-- Check transactions table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'transactions'
  AND column_name IN ('recurring_template_id', 'idempotency_key');

-- Check queue table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'cache_refresh_queue';

-- Check functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('enqueue_cache_refresh', 'process_cache_refresh_queue');
```

Expected output:
```
column_name              | data_type
-------------------------|-----------
recurring_template_id    | uuid
idempotency_key          | text

table_name
--------------------
cache_refresh_queue

routine_name
---------------------------
enqueue_cache_refresh
process_cache_refresh_queue
```

---

## Option 2: Supabase CLI (Advanced)

### Prerequisites
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref [your-project-ref]
```

### Apply Migrations
```bash
# Push all pending migrations
supabase db push

# Or apply specific migration
supabase db push --include 0002_add_recurring_idempotency.sql
supabase db push --include 0003_add_cache_refresh_queue.sql
```

### Verify
```bash
# Check migration status
supabase db diff

# Should show no pending changes
```

---

## Option 3: Manual SQL Execution

If you don't have access to Supabase dashboard:

### Using psql
```bash
# Get connection string from Supabase dashboard (Settings > Database)
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Run migrations
\i supabase/migrations/0002_add_recurring_idempotency.sql
\i supabase/migrations/0003_add_cache_refresh_queue.sql
```

### Using any PostgreSQL client
1. Connect to your Supabase database
2. Execute `0002_add_recurring_idempotency.sql`
3. Execute `0003_add_cache_refresh_queue.sql`

---

## Rollback Instructions

If you need to rollback these migrations:

### Rollback 0003 (Cache Queue)
```sql
-- Drop functions
DROP FUNCTION IF EXISTS process_cache_refresh_queue();
DROP FUNCTION IF EXISTS enqueue_cache_refresh(uuid);

-- Drop table
DROP TABLE IF EXISTS public.cache_refresh_queue CASCADE;
```

### Rollback 0002 (Idempotency)
```sql
-- Drop indexes
DROP INDEX IF EXISTS public.idx_recurring_idempotency;
DROP INDEX IF EXISTS public.idx_recurring_template;

-- Drop columns (WARNING: This will delete data!)
ALTER TABLE public.transactions
  DROP COLUMN IF EXISTS idempotency_key,
  DROP COLUMN IF EXISTS recurring_template_id;
```

⚠️ **WARNING**: Rollback will delete idempotency tracking. Only rollback if:
- No recurring transactions have been created
- You're in a development environment
- You have a database backup

---

## Post-Migration Tasks

### 1. Test Cache Queue Function
```sql
-- Enqueue a test job
SELECT enqueue_cache_refresh('[your-user-id]');

-- Check queue
SELECT * FROM cache_refresh_queue ORDER BY created_at DESC LIMIT 5;

-- Process queue (manual test)
SELECT process_cache_refresh_queue();
```

### 2. Test Recurring Idempotency
```sql
-- Create a test recurring transaction
INSERT INTO transactions (
  user_id,
  amount_minor,
  currency_code,
  direction,
  occurred_at,
  payee,
  is_recurring,
  recur_rule
) VALUES (
  '[your-user-id]',
  1000,
  'USD',
  'out',
  NOW(),
  'Test Monthly Subscription',
  true,
  'FREQ=MONTHLY;INTERVAL=1'
) RETURNING id;

-- Run recurring engine via API
-- POST /api/transactions/recurring/run

-- Verify idempotency_key was set on created instances
SELECT id, payee, occurred_at, idempotency_key
FROM transactions
WHERE recurring_template_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

### 3. Monitor Cache Queue
Set up a periodic check (every 5 minutes) to process the queue:

**Option A: Using pg_cron (if available)**
```sql
-- Requires pg_cron extension
SELECT cron.schedule(
  'process-cache-queue',
  '*/5 * * * *',  -- Every 5 minutes
  $$SELECT process_cache_refresh_queue()$$
);
```

**Option B: Using Supabase Edge Function**
Create a scheduled edge function that calls:
```typescript
await supabase.rpc('process_cache_refresh_queue')
```

**Option C: Using External Cron**
Set up GitHub Actions / Vercel Cron to POST to:
```
POST /api/cache/process-queue
```

---

## Troubleshooting

### Error: "relation cache_refresh_queue does not exist"
- Migration 0003 didn't apply
- Check SQL editor for errors
- Verify you have CREATE TABLE permissions

### Error: "column idempotency_key does not exist"
- Migration 0002 didn't apply
- Check if you're connected to correct database
- Verify transaction table name is correct

### Error: "duplicate key value violates unique constraint"
- Good! The idempotency is working
- This prevents duplicate recurring transactions
- Check `idempotency_key` value to identify duplicate

### Error: "function enqueue_cache_refresh does not exist"
- RPC call using wrong function name
- Check function was created: `\df enqueue_cache_refresh`
- Verify schema is `public`

---

## Verification Checklist

- [ ] Migration 0002 applied successfully
- [ ] Migration 0003 applied successfully
- [ ] Indexes created on transactions table
- [ ] cache_refresh_queue table exists
- [ ] enqueue_cache_refresh function exists
- [ ] process_cache_refresh_queue function exists
- [ ] RLS policies active on cache_refresh_queue
- [ ] Test cache queue enqueue works
- [ ] Test recurring idempotency prevents duplicates
- [ ] Cron job scheduled to process queue (optional but recommended)

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs/guides/database/migrations
- **Project Docs**: See [week-1-2-implementation-summary.md](./week-1-2-implementation-summary.md)
- **SQL Errors**: Check Supabase Dashboard > Logs > Database

---

**Last Updated**: 2025-10-03
