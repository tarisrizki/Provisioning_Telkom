'use client'

export default function TestEnvPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </div>
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 50)}...` : 
                'Not set'
              }
            </div>
          </div>
          
          <div>
            <strong>NODE_ENV:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
              {process.env.NODE_ENV || 'Not set'}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Status:</h4>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Supabase URL:</span>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? 
                <span className="text-green-600">✓ Available</span> : 
                <span className="text-red-600">✗ Missing</span>
              }
            </div>
            <div>
              <span className="font-medium">Supabase Key:</span>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                <span className="text-green-600">✓ Available</span> : 
                <span className="text-red-600">✗ Missing</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
