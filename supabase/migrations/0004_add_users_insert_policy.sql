-- Add INSERT policy for users table
-- This allows authenticated users to insert their own user record

-- Drop existing policy if it exists (for re-running)
drop policy if exists users_insert_self on public.users;

-- Create INSERT policy: users can insert their own record
create policy users_insert_self on public.users
  for insert
  with check (id = auth.uid());

-- Add UPDATE policy as well for completeness
drop policy if exists users_update_self on public.users;

create policy users_update_self on public.users
  for update
  using (id = auth.uid())
  with check (id = auth.uid());
