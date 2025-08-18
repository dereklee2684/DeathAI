-- Check the current state of the role_requests table

-- Show all role requests
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

-- Check specifically for the university we're looking for
SELECT 
    id,
    user_id,
    requested_role,
    university_id,
    request_type,
    status,
    created_at
FROM role_requests 
WHERE university_id = '68f6a442-3376-4ebd-849d-0790a86d36eb'
ORDER BY created_at DESC;

-- Check for any pending requests
SELECT 
    id,
    user_id,
    requested_role,
    university_id,
    request_type,
    status,
    created_at
FROM role_requests 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Check for any alumni requests
SELECT 
    id,
    user_id,
    requested_role,
    university_id,
    request_type,
    status,
    created_at
FROM role_requests 
WHERE requested_role = 'alumni'
ORDER BY created_at DESC; 