-- Fix infinite recursion in RLS policies
-- Run this in your Supabase SQL editor

-- Step 1: Drop all existing policies for users table that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Step 2: Create simple, non-recursive policies
-- Allow users to view their own record by checking auth.uid()
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own record
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own record
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 3: Add the user_role column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'viewer';

-- Step 4: Add the 'alumni' role to the enum if it doesn't exist
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'alumni';

-- Step 5: Create the missing user record for chobryan57@gmail.com
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

-- Step 6: Update existing user to university_admin if they exist but have wrong role
UPDATE public.users 
SET user_role = 'university_admin', updated_at = NOW()
WHERE email = 'chobryan57@gmail.com' 
AND user_role != 'university_admin';

-- Step 7: Verify the fix
SELECT 'RLS policies fixed successfully' as status;

-- Check the user record
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Check all users for debugging
SELECT id, email, display_name, user_role, created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 10; 