"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { testDatabaseConnection, checkEnvironmentVariables } from "@/lib/connection-test"
import { AlertTriangle, CheckCircle, Database, Loader2 } from "lucide-react"

export default function TestConnectionPage() {
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    error?: string
    message?: string
    details?: unknown
  } | null>(null)
  const [envCheck, setEnvCheck] = useState<{
    supabaseUrl: boolean
    supabaseAnonKey: boolean
    allSet: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check environment variables on load
    const envResult = checkEnvironmentVariables()
    setEnvCheck(envResult)
  }, [])

  const runConnectionTest = async () => {
    setIsLoading(true)
    try {
      const result = await testDatabaseConnection()
      setConnectionResult(result)
    } catch (error) {
      setConnectionResult({
        success: false,
        error: 'Failed to run connection test',
        details: error
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1B2431] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Database Connection Test</h1>
          <p className="text-gray-400 text-lg mt-2">Test your Supabase database connection and configuration</p>
          </div>

        {/* Environment Variables Check */}
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Database className="h-5 w-5" />
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {envCheck && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#334155] rounded">
                  <span className="text-gray-300">NEXT_PUBLIC_SUPABASE_URL</span>
                  <div className="flex items-center gap-2">
                    {envCheck.supabaseUrl ? (
                      <><CheckCircle className="h-4 w-4 text-green-400" /><span className="text-green-400">Set</span></>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-red-400" /><span className="text-red-400">Missing</span></>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#334155] rounded">
                  <span className="text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <div className="flex items-center gap-2">
                    {envCheck.supabaseAnonKey ? (
                      <><CheckCircle className="h-4 w-4 text-green-400" /><span className="text-green-400">Set</span></>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-red-400" /><span className="text-red-400">Missing</span></>
              )}
            </div>
                </div>

                {!envCheck.allSet && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                        <h4 className="text-red-400 font-medium">Missing Environment Variables</h4>
                        <p className="text-red-300 text-sm mt-1">
                          Please create a <code className="bg-red-800/30 px-1 py-0.5 rounded">.env.local</code> file in your project root with:
                        </p>
                        <pre className="text-red-200 text-xs mt-2 bg-red-800/20 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5" />
                Database Connection Test
              </div>
              <Button 
                onClick={runConnectionTest}
                disabled={isLoading || !envCheck?.allSet}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Testing...</>
                ) : (
                  'Test Connection'
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded border ${
                  connectionResult.success 
                    ? 'bg-green-900/20 border-green-500/50' 
                    : 'bg-red-900/20 border-red-500/50'
                }`}>
                  <div className="flex items-start gap-3">
                    {connectionResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${
                        connectionResult.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {connectionResult.success ? 'Connection Successful' : 'Connection Failed'}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        connectionResult.success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {connectionResult.message || connectionResult.error}
                      </p>
                      
                      {!!connectionResult.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-400">Show Details</summary>
                          <pre className="text-xs mt-1 bg-black/20 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                            {JSON.stringify(connectionResult.details, null, 2)}
                          </pre>
                        </details>
                      )}
            </div>
          </div>
        </div>

                {!connectionResult.success && (
                  <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded">
                    <h4 className="text-blue-400 font-medium mb-2">Troubleshooting Steps:</h4>
                    <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
                      <li>Verify your Supabase project URL and anon key</li>
                      <li>Check if the &apos;users&apos; table exists in your database</li>
                      <li>Ensure Row Level Security (RLS) policies are configured correctly</li>
                      <li>Check your Supabase project&apos;s API settings</li>
                      <li>Restart your development server after updating .env.local</li>
                    </ol>
                </div>
              )}
            </div>
          ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Click &quot;Test Connection&quot; to check your database connection</p>
            </div>
          )}
          </CardContent>
        </Card>

        {/* SQL Schema */}
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white">SQL Schema for Users Table</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">
              If the connection test fails, make sure you&apos;ve executed this SQL in your Supabase SQL editor:
            </p>
            <pre className="text-xs bg-[#0f172a] p-4 rounded overflow-x-auto text-green-400">
{`-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default users (password is 'password')
INSERT INTO users (username, email, name, password_hash, role) VALUES 
('admin', 'admin@provisioning.com', 'Administrator', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.U2oOha', 'admin'),
('taris', 'taris123@gmail.com', 'Taris Rizki', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.U2oOha', 'user');`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}