-- Make user with chobryan04@gmail.com a platform admin
-- Run this in your Supabase SQL editor

-- Step 1: Check if user exists in auth.users
SELECT 
    'Checking auth.users' as step,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Step 2: Check if user exists in public.users
SELECT 
    'Checking public.users' as step,
    id,
    email,
    display_name,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- Step 3: Add user_role column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'viewer';

-- Step 4: Insert user into public.users if they don't exist
INSERT INTO public.users (id, email, display_name, user_role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', au.email),
    'platform_admin'
FROM auth.users au
WHERE au.email = 'chobryan04@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Step 5: Update existing user to platform_admin if they already exist
UPDATE public.users 
SET user_role = 'platform_admin'
WHERE email = 'chobryan04@gmail.com';

-- Step 6: Verify the result
SELECT 
    'Final result' as step,
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com'; 