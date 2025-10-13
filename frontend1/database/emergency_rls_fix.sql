-- EMERGENCY FIX: Temporarily disable RLS for users table to allow profile creation
-- This is a quick fix - run this in Supabase SQL editor

-- Temporarily disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Now try creating a test profile manually
-- Replace 'your-user-id-here' with the actual user ID from the debug component
-- INSERT INTO public.users (id, name, email, role) 
-- VALUES ('f4a5ddbd-f24b-4b89-91e7-04ac80e63d34', 'Anand', 'anand@aveoearth.com', 'buyer');

-- After testing, you can re-enable RLS with proper policies:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

