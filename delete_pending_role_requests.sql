-- Delete all pending role requests from the role_requests table
-- This will remove all requests with status = 'pending'

-- First, let's see what we're about to delete
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
WHERE status = 'pending';

-- Now delete all pending requests
DELETE FROM role_requests 
WHERE status = 'pending';

-- Verify the deletion by checking remaining requests
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