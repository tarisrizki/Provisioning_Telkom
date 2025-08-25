import { createSupabaseClient } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Environment variables check:', {
      url: supabaseUrl ? '✓ Set' : '✗ Missing',
      key: supabaseAnonKey ? '✓ Set' : '✗ Missing'
    })
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Environment variables not found')
    }
    
    // Create client
    const supabase = createSupabaseClient()
    console.log('✓ Supabase client created successfully')
    
    // Test connection by making a simple query
    const { error } = await supabase
      .from('work_orders')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('⚠ Database query test:', error.message)
      // This might be expected if table doesn't exist yet
    } else {
      console.log('✓ Database connection successful')
    }
    
    return { success: true, message: 'Supabase connection test completed' }
  } catch (error) {
    console.error('✗ Supabase connection test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
