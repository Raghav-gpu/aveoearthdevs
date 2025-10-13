-- Fix existing RLS policies for users table
-- Run this script in your Supabase SQL editor

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can create profile" ON public.users;

-- Temporarily disable RLS to allow profile creation
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Now create the correct policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create new policies that work properly
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Verify the new policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Test: Try to insert a test profile (replace with your actual user ID)
-- INSERT INTO public.users (id, name, email, role) 
-- VALUES ('f4a5ddbd-f24b-4b89-91e7-04ac80e63d34', 'Anand', 'anand@aveoearth.com', 'buyer');

