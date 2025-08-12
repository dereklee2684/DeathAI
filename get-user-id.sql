-- Get user ID for email: chobryan04@gmail.com
-- Run this in your Supabase SQL editor

-- Get the user ID from auth.users table
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Also check in public.users table
SELECT 
    id,
    email,
    display_name,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com'; 