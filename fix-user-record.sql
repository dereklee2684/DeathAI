-- Fix user record for chobryan04@gmail.com
-- Run this in your Supabase SQL editor

-- Step 1: Add user_role column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'viewer';

-- Step 2: Check if user exists in auth.users
SELECT 
    'auth.users check' as step,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Step 3: Check if user exists in public.users
SELECT 
    'public.users check' as step,
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- Step 4: Insert user into public.users if they don't exist
INSERT INTO public.users (id, email, display_name, user_role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', au.email),
    COALESCE((au.raw_user_meta_data->>'user_role')::user_role, 'viewer')
FROM auth.users au
WHERE au.email = 'chobryan04@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Step 5: Update user role to platform_admin if they exist
UPDATE public.users 
SET user_role = 'platform_admin'
WHERE email = 'chobryan04@gmail.com';

-- Step 6: Verify the result
SELECT 
    'final result' as step,
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com'; 