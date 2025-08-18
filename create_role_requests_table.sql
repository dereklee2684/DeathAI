-- Create role_requests table
CREATE TABLE IF NOT EXISTS role_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('university_admin', 'platform_admin')),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON role_requests(status);
CREATE INDEX IF NOT EXISTS idx_role_requests_university_id ON role_requests(university_id);

-- Enable Row Level Security
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own requests
CREATE POLICY "Users can view own role requests" ON role_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create own role requests" ON role_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Platform admins can view all requests
CREATE POLICY "Platform admins can view all role requests" ON role_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Platform admins can update request status
CREATE POLICY "Platform admins can update role requests" ON role_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role = 'platform_admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_role_requests_updated_at 
  BEFORE UPDATE ON role_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 