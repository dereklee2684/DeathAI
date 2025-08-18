-- Add constraint to ensure university admins have a university_id
-- First, let's fix any existing university admins without university_id
UPDATE users 
SET user_role = 'viewer' 
WHERE user_role = 'university_admin' AND university_id IS NULL;

-- Now add the constraint
ALTER TABLE users ADD CONSTRAINT check_university_admin_has_university 
  CHECK (
    (user_role = 'university_admin' AND university_id IS NOT NULL) OR 
    (user_role != 'university_admin')
  ); 