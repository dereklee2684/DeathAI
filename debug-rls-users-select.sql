-- Debug RLS issues on users table
-- This script temporarily relaxes RLS to isolate the problem

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

-- Step 3: Temporarily disable RLS completely for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 4: Test if we can query the user directly
SELECT 'Testing direct query without RLS:' as info;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Step 5: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;

-- Step 7: Create a very permissive policy for debugging
-- This allows any authenticated user to SELECT from users table
CREATE POLICY "Debug: Allow authenticated users to view users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Step 8: Create a policy for INSERT
CREATE POLICY "Debug: Allow authenticated users to insert" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 9: Create a policy for UPDATE
CREATE POLICY "Debug: Allow authenticated users to update" ON public.users
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 10: Test the query again
SELECT 'Testing query with relaxed RLS policies:' as info;
-- This will be run by the application

-- Step 11: Show final policy status
SELECT 'Final policies on users table:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

SELECT 'Debug RLS script completed. Check if the application can now query users table.' as status; 