-- Update the requested_role constraint to include 'alumni'
-- First, drop the existing constraint
ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_requested_role_check;

-- Add the new constraint that includes 'alumni'
ALTER TABLE role_requests ADD CONSTRAINT role_requests_requested_role_check 
  CHECK (requested_role IN ('university_admin', 'platform_admin', 'alumni')); 