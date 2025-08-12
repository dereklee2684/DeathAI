-- Check user role for UUID: 9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce
-- Run this in your Supabase SQL editor

-- Check if user_role column exists and what the user's role is
SELECT 
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE id = '9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce';

-- If the above doesn't work (user_role column doesn't exist), try this:
-- SELECT 
--     id,
--     email,
--     display_name,
--     created_at
-- FROM public.users 
-- WHERE id = '9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce'; 