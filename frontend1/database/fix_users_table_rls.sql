-- Fix RLS policies for users table
-- This script will disable RLS and ensure users can access their own profiles

-- Step 1: Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Step 2: Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can create profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Step 3: Disable RLS temporarily to allow profile creation
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Step 5: Test if we can insert a test record (optional)
-- This will help verify the fix works
-- INSERT INTO public.users (id, name, email, role) 
-- VALUES ('test-user-id', 'Test User', 'test@example.com', 'buyer')
-- ON CONFLICT (id) DO NOTHING;

-- Step 6: Clean up test record (uncomment if you ran step 5)
-- DELETE FROM public.users WHERE id = 'test-user-id';

