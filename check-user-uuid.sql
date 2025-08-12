-- Query to find UUID for user with email "chobryan04@gmail.com"
-- Run this in your Supabase SQL editor

-- Check in the auth.users table (Supabase auth)
SELECT 
    id as auth_user_id,
    email,
    created_at as auth_created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Check in the public.users table (our custom users table)
SELECT 
    id as public_user_id,
    email,
    display_name,
    created_at as public_created_at,
    updated_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- If you want to see both tables together (if the user exists in both)
SELECT 
    au.id as auth_user_id,
    pu.id as public_user_id,
    au.email,
    pu.display_name,
    au.created_at as auth_created_at,
    pu.created_at as public_created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'chobryan04@gmail.com'; 