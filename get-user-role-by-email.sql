-- Get user role for email: chobryan04@gmail.com
-- Run this in your Supabase SQL editor

-- Get user role from public.users table
SELECT 
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- If the above doesn't work (user_role column doesn't exist), try this:
-- SELECT 
--     id,
--     email,
--     display_name,
--     created_at
-- FROM public.users 
-- WHERE email = 'chobryan04@gmail.com'; 