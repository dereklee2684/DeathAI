-- Check if user exists in both tables
-- Run this in your Supabase SQL editor

-- Check if user exists in auth.users (Supabase auth)
SELECT 
    'auth.users' as table_name,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Check if user exists in public.users (our custom table)
SELECT 
    'public.users' as table_name,
    id,
    email,
    display_name,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- Check all users in public.users to see what's there
SELECT 
    'all public users' as info,
    COUNT(*) as total_users
FROM public.users;

-- Show a few sample users from public.users
SELECT 
    id,
    email,
    display_name,
    created_at
FROM public.users 
LIMIT 5; 