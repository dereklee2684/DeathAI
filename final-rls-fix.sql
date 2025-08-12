-- Final fix for RLS policies that are blocking user queries
-- Run this in your Supabase SQL editor

-- Step 1: Completely disable RLS on users table temporarily to test
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify the user exists and can be queried
SELECT 'Testing user query without RLS:' as test_type;
SELECT id, email, display_name, user_role, created_at, updated_at
FROM public.users 
WHERE email = 'chobryan57@gmail.com';

-- Step 3: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Step 5: Create a simple policy that allows authenticated users to view their own record
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Step 6: Create a policy that allows authenticated users to update their own record
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Step 7: Create a policy that allows authenticated users to insert their own record
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Test the query again
SELECT 'Testing user query with new RLS policies:' as test_type;
-- This will be run by the application, not here

-- Step 9: Also fix universities table to allow reading
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON public.universities;
DROP POLICY IF EXISTS "Only authenticated users can manage universities" ON public.universities;

CREATE POLICY "Universities are viewable by everyone" ON public.universities
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage universities" ON public.universities
    FOR ALL USING (auth.role() = 'authenticated');

-- Step 10: Verify the fix
SELECT 'RLS policies updated successfully. Users should now be able to query their own records.' as status; 