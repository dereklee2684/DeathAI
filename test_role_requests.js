// Simple test script to check role requests
const { createClient } = require('@supabase/supabase-js')

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRoleRequests() {
  try {
    // Check if the role_requests table exists and has the right columns
    const { data: tableInfo, error: tableError } = await supabase
      .from('role_requests')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.log('Error accessing role_requests table:', tableError)
      return
    }
    
    console.log('Role requests table is accessible')
    
    // Check for any existing role requests
    const { data: requests, error: requestsError } = await supabase
      .from('role_requests')
      .select('*')
    
    if (requestsError) {
      console.log('Error fetching role requests:', requestsError)
      return
    }
    
    console.log('Total role requests:', requests.length)
    console.log('Requests:', requests)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testRoleRequests() 