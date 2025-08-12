-- Create user record for chobryan57@gmail.com
-- This script directly inserts the user into public.users table

-- First, let's check if the user exists in auth.users
SELECT 'Checking auth.users for chobryan57@gmail.com:' as info;
SELECT id, email, created_at
FROM auth.users 
WHERE email = 'chobryan57@gmail.com';

-- Now let's check if the user exists in public.users
SELECT 'Checking public.users for chobryan57@gmail.com:' as info;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Insert the user record if it doesn't exist
-- We'll use the ID from auth.users (you may need to adjust this ID)
INSERT INTO public.users (id, email, display_name, user_role, created_at, updated_at)
VALUES (
    '7aba76fb-3d47-4bd7-a889-e1ab22949ff0', -- This is the ID from your console logs
    'chobryan57@gmail.com',
    'Bryan Cho',
    'university_admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    user_role = EXCLUDED.user_role,
    updated_at = NOW();

-- Verify the user was created/updated
SELECT 'Verifying user record after insert/update:' as info;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Also verify by ID
SELECT 'Verifying user record by ID:' as info;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE id = '7aba76fb-3d47-4bd7-a889-e1ab22949ff0';

SELECT 'User record creation/update completed successfully!' as status; 