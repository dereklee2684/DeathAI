// Script to update the role_requests table schema
const { createClient } = require('@supabase/supabase-js')

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function updateSchema() {
  try {
    console.log('Updating role_requests table schema...')
    
    // Add new columns to role_requests table
    const updates = [
      // Add profile_id column
      "ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE",
      
      // Add request_type column
      "ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'role_change' CHECK (request_type IN ('role_change', 'alumni_verification', 'new_profile'))",
      
      // Add existing_profile_name column
      "ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS existing_profile_name TEXT",
      
      // Add new_profile_name column
      "ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS new_profile_name TEXT",
      
      // Update the requested_role check to include 'alumni'
      "ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_requested_role_check",
      "ALTER TABLE role_requests ADD CONSTRAINT role_requests_requested_role_check CHECK (requested_role IN ('university_admin', 'platform_admin', 'alumni'))",
      
      // Create indexes
      "CREATE INDEX IF NOT EXISTS idx_role_requests_request_type ON role_requests(request_type)",
      "CREATE INDEX IF NOT EXISTS idx_role_requests_profile_id ON role_requests(profile_id)"
    ]
    
    for (const update of updates) {
      const { error } = await supabase.rpc('exec_sql', { sql: update })
      if (error) {
        console.log('Error executing:', update)
        console.log('Error:', error)
      } else {
        console.log('Successfully executed:', update)
      }
    }
    
    console.log('Schema update completed!')
    
  } catch (error) {
    console.error('Error updating schema:', error)
  }
}

updateSchema() 