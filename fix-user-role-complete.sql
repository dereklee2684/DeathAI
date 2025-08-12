-- Complete fix for user role issues
-- Run this in your Supabase SQL editor

-- Step 1: Add the 'alumni' role to the user_role enum if it doesn't exist
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'alumni';

-- Step 2: Add user_role column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'viewer';

-- Step 3: Create the missing user record for chobryan57@gmail.com
INSERT INTO public.users (id, email, display_name, user_role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', au.email),
    'university_admin', -- Set as university_admin as requested
    au.created_at,
    NOW()
FROM auth.users au
WHERE au.email = 'chobryan57@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Step 4: Update existing user to university_admin if they exist but have wrong role
UPDATE public.users 
SET user_role = 'university_admin', updated_at = NOW()
WHERE email = 'chobryan57@gmail.com' 
AND user_role != 'university_admin';

-- Step 5: Fix RLS policies to allow proper access
-- Drop all existing policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;

-- Create new policies that allow users to view and update their own records
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow platform admins to view all users
CREATE POLICY "Platform admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND user_role = 'platform_admin'
        )
    );

-- Allow platform admins to update all users
CREATE POLICY "Platform admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND user_role = 'platform_admin'
        )
    );

-- Allow users to insert their own record (for new users)
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 6: Fix universities table policies to allow reading
DROP POLICY IF EXISTS "Universities are viewable by all authenticated users" ON public.universities;
DROP POLICY IF EXISTS "All authenticated users can manage universities for development" ON public.universities;
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON public.universities;
DROP POLICY IF EXISTS "Only authenticated users can manage universities" ON public.universities;

CREATE POLICY "Universities are viewable by everyone" ON public.universities
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage universities" ON public.universities
    FOR ALL USING (auth.role() = 'authenticated');

-- Step 7: Verify the fix
SELECT 'User record created/updated successfully' as status;

-- Check the user record
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Check all users for debugging
SELECT id, email, display_name, user_role, created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 10; 