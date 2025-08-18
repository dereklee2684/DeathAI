-- Add university_id column to users table
-- This allows university admins to be associated with a specific university
ALTER TABLE users ADD COLUMN university_id UUID REFERENCES universities(id) ON DELETE SET NULL;

-- Add an index for better performance when querying by university_id
CREATE INDEX IF NOT EXISTS idx_users_university_id ON users(university_id);

-- Add a check constraint to ensure university_id is only set for university_admin role
-- Note: This constraint will be enforced for new records, but existing data may need to be fixed first
-- ALTER TABLE users ADD CONSTRAINT check_university_admin_has_university 
--   CHECK (
--     (user_role = 'university_admin' AND university_id IS NOT NULL) OR 
--     (user_role != 'university_admin')
--   ); 