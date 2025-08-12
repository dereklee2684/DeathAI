-- List all users in the database
-- Run this in your Supabase SQL editor

-- List all users from auth.users
SELECT 
    'auth.users' as table_name,
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- List all users from public.users
SELECT 
    'public.users' as table_name,
    id,
    email,
    display_name,
    created_at
FROM public.users 
ORDER BY created_at DESC;

-- Count total users in each table
SELECT 
    'auth.users count' as info,
    COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
    'public.users count' as info,
    COUNT(*) as total
FROM public.users; 