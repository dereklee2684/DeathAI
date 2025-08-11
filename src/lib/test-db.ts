import { createClient } from '@/lib/supabase'

export async function testDatabaseConnection() {
  const supabase = createClient()
  
  try {
    // Test basic connection
    const { error } = await supabase
      .from('universities')
      .select('count')
      .limit(1)
    
    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }
    }
    
    // Test getting all universities
    const { data: universities, error: universitiesError } = await supabase
      .from('universities')
      .select('*')
    
    if (universitiesError) {
      return {
        success: false,
        error: universitiesError.message,
        code: universitiesError.code,
        details: universitiesError.details
      }
    }
    
    return {
      success: true,
      universitiesCount: universities?.length || 0,
      universities: universities
    }
    
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    }
  }
} 