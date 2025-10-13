-- Migration: Add profile fields to users table
-- Run this script in your Supabase SQL editor to add the new profile fields

-- Add new columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS alternate_address TEXT;

-- Update the updated_at trigger to include new fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists for the users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.users.phone IS 'User phone number';
COMMENT ON COLUMN public.users.address IS 'User primary address';
COMMENT ON COLUMN public.users.city IS 'User city';
COMMENT ON COLUMN public.users.state IS 'User state/province';
COMMENT ON COLUMN public.users.zip_code IS 'User ZIP/postal code';
COMMENT ON COLUMN public.users.alternate_address IS 'User alternate address (optional)';

