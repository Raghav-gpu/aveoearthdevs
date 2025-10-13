-- Temporarily disable RLS to test if that's the issue
-- This will allow all operations on the users table

-- Check current status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Disable RLS completely
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';
