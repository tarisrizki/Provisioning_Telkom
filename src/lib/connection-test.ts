import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection with a simple select
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Database connection test failed:', error)
      
      // Handle empty error object
      const errorMessage = error.message || error.details || 'Unknown database error'
      const errorCode = error.code || 'unknown'
      
      return {
        success: false,
        error: `${errorCode}: ${errorMessage}`,
        details: {
          ...error,
          suggestion: error.code === '42P01' ? 'Table &quot;users&quot; does not exist. Please create it using the provided SQL.' : 'Check your database configuration.'
        }
      }
    }
    
    console.log('Database connection successful!')
    return {
      success: true,
      message: 'Database connection is working',
      data
    }
  } catch (error) {
    console.error('Connection test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network or connection error',
      details: error
    }
  }
}

export function checkEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Environment Variables Check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey?.length + ')' : 'Missing')
  
  return {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
    allSet: !!(supabaseUrl && supabaseAnonKey)
  }
}
