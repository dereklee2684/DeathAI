-- Fix user database issue - ensure user exists in public.users
-- Run this in your Supabase SQL editor

-- 1. First, check if the user exists in auth.users
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- 2. Check if user exists in public.users
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- 3. Create the user in public.users if they don't exist
INSERT INTO public.users (id, email, display_name, user_role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', au.email),
    'platform_admin',
    au.created_at,
    NOW()
FROM auth.users au
WHERE au.email = 'chobryan04@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- 4. Update existing user to platform_admin if they exist but have wrong role
UPDATE public.users 
SET user_role = 'platform_admin', updated_at = NOW()
WHERE email = 'chobryan04@gmail.com' 
AND user_role != 'platform_admin';

-- 5. Verify the final state
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com'; 