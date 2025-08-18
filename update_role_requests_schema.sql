-- Update role_requests table to support alumni requests
-- Add new columns for alumni request functionality

-- Add profile_id column for linking to existing profiles
ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Add request_type column to distinguish between different types of requests
ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'role_change' CHECK (request_type IN ('role_change', 'alumni_verification', 'new_profile'));

-- Add existing_profile_name for when user claims to be an existing alumni
ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS existing_profile_name TEXT;

-- Add new_profile_name for when user wants to create a new profile
ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS new_profile_name TEXT;

-- Update the requested_role check to include 'alumni'
ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_requested_role_check;we
ALTER TABLE role_requests ADD CONSTRAINT role_requests_requested_role_check 
  CHECK (requested_role IN ('university_admin', 'platform_admin', 'alumni'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_requests_request_type ON role_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_role_requests_profile_id ON role_requests(profile_id); 