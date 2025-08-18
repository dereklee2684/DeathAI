-- Check and fix RLS policies for role_requests table

-- First, let's see what RLS policies currently exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'role_requests';

-- Check if RLS is enabled on the table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'role_requests';

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own role requests" ON role_requests;
DROP POLICY IF EXISTS "Platform admins can view all role requests" ON role_requests;
DROP POLICY IF EXISTS "Platform admins can update role requests" ON role_requests;
DROP POLICY IF EXISTS "Users can create own role requests" ON role_requests;
DROP POLICY IF EXISTS "University admins can view alumni requests for their university" ON role_requests;
DROP POLICY IF EXISTS "University admins can update alumni requests for their university" ON role_requests;

-- Create new policies that allow university admins to see alumni requests for their university
CREATE POLICY "University admins can view alumni requests for their university" ON role_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'university_admin'
      AND users.university_id = role_requests.university_id
    )
  );

-- Allow platform admins to view all requests
CREATE POLICY "Platform admins can view all role requests" ON role_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Allow users to view their own requests
CREATE POLICY "Users can view own role requests" ON role_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Allow platform admins to update request status
CREATE POLICY "Platform admins can update role requests" ON role_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Allow university admins to update alumni requests for their university
CREATE POLICY "University admins can update alumni requests for their university" ON role_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'university_admin'
      AND users.university_id = role_requests.university_id
    )
  );

-- Allow users to create their own requests
CREATE POLICY "Users can create own role requests" ON role_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Test the policies by checking what the current user can see
SELECT 
    id,
    user_id,
    requested_role,
    university_id,
    request_type,
    status,
    created_at
FROM role_requests 
ORDER BY created_at DESC; 