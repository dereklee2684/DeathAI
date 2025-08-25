-- Add 'organizations' to the request_type constraint
-- First, drop the existing constraint
ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_request_type_check;

-- Add the new constraint that includes 'organizations'
ALTER TABLE role_requests ADD CONSTRAINT role_requests_request_type_check 
  CHECK (request_type IN ('role_change', 'alumni_verification', 'new_profile', 'organizations')); 