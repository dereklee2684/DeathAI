-- Debug script to check user role and fix platform_admin access
-- Run these queries one by one in your Supabase SQL editor

-- 1. Check if user exists in auth.users
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- 2. Check if user exists in public.users and their role
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- 3. Check all users in public.users to see the structure
SELECT id, email, display_name, user_role, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if user_role column exists and what values are allowed
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
AND column_name = 'user_role';

-- 5. Check the user_role enum values
SELECT enumlabel
FROM pg_enum
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
WHERE pg_type.typname = 'user_role';

-- 6. If user doesn't exist in public.users, create them as platform_admin
-- (Only run this if step 2 returns no rows)
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

-- 7. Update existing user to platform_admin (only run if step 2 shows wrong role)
UPDATE public.users 
SET user_role = 'platform_admin', updated_at = NOW()
WHERE email = 'chobryan04@gmail.com';

-- 8. Verify the final state
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com'; 