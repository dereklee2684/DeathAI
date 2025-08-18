-- Check and fix role_requests table for missing request_type values

-- First, let's see the current state of all role requests
SELECT 
    id,
    user_id,
    requested_role,
    university_id,
    request_type,
    status,
    created_at,
    existing_profile_name,
    new_profile_name
FROM role_requests 
ORDER BY created_at DESC;

-- Check if the request_type column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'role_requests' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Update existing alumni requests to have the correct request_type
-- For requests with requested_role = 'alumni' and NULL request_type
UPDATE role_requests 
SET request_type = 'alumni_verification'
WHERE requested_role = 'alumni' 
AND (request_type IS NULL OR request_type = '');

-- Update existing university_admin requests to have the correct request_type
UPDATE role_requests 
SET request_type = 'role_change'
WHERE requested_role = 'university_admin' 
AND (request_type IS NULL OR request_type = '');

-- Update existing platform_admin requests to have the correct request_type
UPDATE role_requests 
SET request_type = 'role_change'
WHERE requested_role = 'platform_admin' 
AND (request_type IS NULL OR request_type = '');

-- Verify the updates
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