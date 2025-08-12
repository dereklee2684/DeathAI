-- Check if user exists in auth.users but not public.users
-- Run this in your Supabase SQL editor

-- Check auth.users table
SELECT 
    'auth.users' as table_name,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'chobryan04@gmail.com';

-- Check public.users table
SELECT 
    'public.users' as table_name,
    id,
    email,
    display_name,
    created_at
FROM public.users 
WHERE email = 'chobryan04@gmail.com';

-- Check if the trigger function exists
SELECT 
    'trigger function check' as info,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if the trigger exists
SELECT 
    'trigger check' as info,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 