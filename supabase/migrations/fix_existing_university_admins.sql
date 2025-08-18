-- Fix existing university admins who don't have a university_id
-- First, let's see what we're working with
-- SELECT id, email, user_role, university_id FROM users WHERE user_role = 'university_admin';

-- For now, let's temporarily change existing university admins to 'viewer' role
-- since we don't know which university they should be assigned to
UPDATE users 
SET user_role = 'viewer' 
WHERE user_role = 'university_admin' AND university_id IS NULL;

-- Alternative: If you want to assign them to a default university (e.g., first university in the system)
-- UPDATE users 
-- SET university_id = (SELECT id FROM universities LIMIT 1)
-- WHERE user_role = 'university_admin' AND university_id IS NULL; 