-- Make user platform admin
-- Run this in your Supabase SQL editor

-- First, let's check if the user exists and see their current info
SELECT 
    id,
    email,
    display_name,
    created_at
FROM public.users 
WHERE id = '9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce';

-- If the user exists, we need to add the user_role column first (if it doesn't exist)
-- Then update their role to platform_admin

-- Step 1: Add user_role column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'viewer';

-- Step 2: Update the user to be platform_admin
UPDATE public.users 
SET user_role = 'platform_admin'
WHERE id = '9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce';

-- Step 3: Verify the update worked
SELECT 
    id,
    email,
    display_name,
    user_role,
    created_at
FROM public.users 
WHERE id = '9bd2cc3e-dd5d-404c-b913-12ddc6fd0bce'; 