// Test koneksi Supabase sederhana
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n')
  
  try {
    // Test 1: Environment Variables
    console.log('1️⃣ Testing Environment Variables:')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('URL Length:', supabaseUrl?.length || 0)
    console.log('Key Length:', supabaseKey?.length || 0)
    console.log('URL Available:', !!supabaseUrl)
    console.log('Key Available:', !!supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Environment variables tidak tersedia')
    }
    
    console.log('✅ Environment variables tersedia!')
    
    // Test 2: Import dan buat client
    console.log('\n2️⃣ Testing Supabase Client Creation:')
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase client berhasil dibuat')
    
    // Test 3: Database query sederhana
    console.log('\n3️⃣ Testing Database Connection:')
    const { count, error } = await supabase
      .from('test')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Database query error:', error.message)
      console.log('🔍 Error details:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Database connection berhasil!')
    console.log(`📊 Total work orders: ${count || 0}`)
    
    return { success: true, count: count || 0 }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return { success: false, error: error.message }
  }
}
