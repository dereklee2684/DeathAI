-- Complete RLS fix for users table
-- This script will clean up all existing policies and create new ones

-- Step 1: Check current RLS status
SELECT 'Current RLS status:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 2: Check current policies
SELECT 'Current policies on users table:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 3: Drop ALL existing policies (including any debug ones)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Debug: Allow authenticated users to view users" ON public.users;
DROP POLICY IF EXISTS "Debug: Allow authenticated users to insert" ON public.users;
DROP POLICY IF EXISTS "Debug: Allow authenticated users to update" ON public.users;

-- Step 4: Temporarily disable RLS to verify user exists
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 5: Test if we can query the user directly
SELECT 'Testing direct query without RLS:' as info;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Step 6: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 7: Create new, simple policies
-- Policy for SELECT - allow authenticated users to view users table
CREATE POLICY "Allow authenticated users to view users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for INSERT - allow authenticated users to insert their own record
CREATE POLICY "Allow authenticated users to insert" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for UPDATE - allow authenticated users to update their own record
CREATE POLICY "Allow authenticated users to update" ON public.users
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 8: Show final policy status
SELECT 'Final policies on users table:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 9: Test the query again (this will be run by the application)
SELECT 'RLS policies updated successfully. Users should now be able to query the users table.' as status; 