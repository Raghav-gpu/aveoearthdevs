-- SIMPLE FIX: Just disable RLS temporarily
-- Run this script in your Supabase SQL editor

-- Disable RLS on users table completely
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled (should show rowsecurity = false)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- That's it! Now try the "Test Profile Creation" button on your website

