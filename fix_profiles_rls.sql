-- Fix RLS policies for profiles table to allow university admins to create profiles

-- First, let's see what RLS policies currently exist for profiles
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
WHERE tablename = 'profiles';

-- Check if RLS is enabled on the profiles table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can create own profiles" ON profiles;
DROP POLICY IF EXISTS "University admins can create profiles for their university" ON profiles;
DROP POLICY IF EXISTS "Platform admins can create profiles" ON profiles;

-- Allow university admins to create profiles for their university
CREATE POLICY "University admins can create profiles for their university" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'university_admin'
      AND users.university_id = profiles.university_id
    )
  );

-- Allow platform admins to create profiles
CREATE POLICY "Platform admins can create profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Allow users to create their own profiles
CREATE POLICY "Users can create own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Allow university admins to view profiles for their university
CREATE POLICY "University admins can view profiles for their university" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'university_admin'
      AND users.university_id = profiles.university_id
    )
  );

-- Allow platform admins to view all profiles
CREATE POLICY "Platform admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Allow users to view their own profiles
CREATE POLICY "Users can view own profiles" ON profiles
  FOR SELECT USING (auth.uid() = created_by);

-- Allow university admins to update profiles for their university
CREATE POLICY "University admins can update profiles for their university" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'university_admin'
      AND users.university_id = profiles.university_id
    )
  );

-- Allow platform admins to update all profiles
CREATE POLICY "Platform admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = created_by); 