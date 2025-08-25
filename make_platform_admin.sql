-- Make user with UUID a viewer
UPDATE users 
SET user_role = 'viewer' 
WHERE id = 'e197ff79-aff4-4500-b770-2241055fd32b';

-- Verify the change
SELECT id, email, user_role, created_at 
FROM users 
WHERE id = 'e197ff79-aff4-4500-b770-2241055fd32b'; 