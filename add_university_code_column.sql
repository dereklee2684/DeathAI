-- Add code column to universities table
-- This adds a human-readable code column for easier reference

ALTER TABLE universities ADD COLUMN code VARCHAR(20) UNIQUE;

-- Add an index for better performance when searching by code
CREATE INDEX idx_universities_code ON universities(code);

-- Note: After running this, you can update existing universities with codes if needed
-- Example: UPDATE universities SET code = 'harvard' WHERE name = 'Harvard University'; 