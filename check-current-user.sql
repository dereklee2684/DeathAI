-- Check the current state of the user in the database
-- Run this in your Supabase SQL editor

-- 1. Check if user exists in auth.users
SELECT 'Auth Users Check:' as check_type;
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'chobryan57@gmail.com';

-- 2. Check if user exists in public.users and what their role is
SELECT 'Public Users Check:' as check_type;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- 3. Check if user_role column exists in users table
SELECT 'Table Schema Check:' as check_type;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name = 'user_role';

-- 4. Check all users to see the pattern
SELECT 'All Users Check:' as check_type;
SELECT id, email, display_name, user_role, created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check if there are any RLS policies blocking access
SELECT 'RLS Policies Check:' as check_type;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users'; 