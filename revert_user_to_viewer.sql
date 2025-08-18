-- Revert user from alumni to viewer role
-- User ID: e197ff79-aff4-4500-b770-2241055fd32b

UPDATE users 
SET user_role = 'viewer' 
WHERE id = 'e197ff79-aff4-4500-b770-2241055fd32b';

-- Verify the change
SELECT id, email, user_role, university_id 
FROM users 
WHERE id = 'e197ff79-aff4-4500-b770-2241055fd32b'; 