-- Simple query to find user with email "chobryan04@gmail.com"
-- Run this single query in your Supabase SQL editor

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