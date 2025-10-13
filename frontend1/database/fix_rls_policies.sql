-- Fix RLS policies to allow Google-authenticated users to create profiles
-- Run this script in your Supabase SQL editor

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create new policies that allow profile creation for authenticated users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Also ensure the users table allows inserts for authenticated users
-- This policy allows any authenticated user to insert a profile
CREATE POLICY "Authenticated users can create profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Test query to verify RLS is working
-- This should return the current user's profile if it exists
SELECT * FROM public.users WHERE id = auth.uid();

