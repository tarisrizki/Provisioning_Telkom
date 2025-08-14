'use client'

import { useState, useEffect } from 'react'
import { testSupabaseConnection } from '@/lib/test-connection'
import { DatabaseService } from '@/lib/database'

interface TestResult {
  success: boolean
  message?: string
  error?: string
}

interface DataStats {
  totalRecords: number
  totalColumns: number
  sampleData: Array<Record<string, string>>
}

interface IntegrityReport {
  totalRecords: number
  missingData: number
  dataQuality: string
}

interface UploadRecord {
  id: string
  filename: string
  total_rows: number
  total_columns: number
  upload_date: string
  status: string
  created_at: string
}

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dataStats, setDataStats] = useState<DataStats | null>(null)
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null)
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([])

  const runTest = async () => {
    setIsLoading(true)
    try {
      const result = await testSupabaseConnection()
      setTestResult(result)
      
      // Get additional data if connection is successful
      if (result.success) {
        await getDataStats()
        await getIntegrityReport()
        await getUploadHistory()
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDataStats = async () => {
    try {
      const result = await DatabaseService.getWorkOrderStats()
      if (result.success && result.data) {
        setDataStats({
          totalRecords: result.data.total_work_orders || 0,
          totalColumns: 11, // Fixed columns
          sampleData: [] // WorkOrderStats doesn't have sampleData
        })
      }
    } catch (error) {
      console.error('Failed to get data stats:', error)
    }
  }

  const getIntegrityReport = async () => {
    try {
      const result = await DatabaseService.getDataIntegrityReport()
      if (result.success && result.data) {
        setIntegrityReport({
          totalRecords: result.data.totalRecords || 0,
          missingData: result.data.missingData || 0,
          dataQuality: result.data.dataQuality || '0%'
        })
      }
    } catch (error) {
      console.error('Failed to get integrity report:', error)
    }
  }

  const getUploadHistory = async () => {
    try {
      const result = await DatabaseService.getUploadHistory()
      if (result.success) {
        setUploadHistory(result.data || [])
      }
    } catch (error) {
      console.error('Failed to get upload history:', error)
    }
  }

  useEffect(() => {
    // Auto-run test on page load
    runTest()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection & Data Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Connection Test</h2>
          
          <div className="mb-4">
            <button
              onClick={runTest}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {isLoading ? 'Testing...' : 'Run Test Again'}
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg ${
              testResult.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✓ Test Passed' : '✗ Test Failed'}
              </h3>
              
              {testResult.message && (
                <p className="text-sm mb-2">{testResult.message}</p>
              )}
              
              {testResult.error && (
                <div className="text-sm">
                  <strong>Error:</strong> {testResult.error}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Environment Variables Check:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <span className="text-green-600">✓ Set</span>
                ) : (
                  <span className="text-red-600">✗ Missing</span>
                )}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <span className="text-green-600">✓ Set</span>
                ) : (
                  <span className="text-red-600">✗ Missing</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Database Statistics</h2>
          
          {dataStats ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Work Orders</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {dataStats.totalRecords?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-blue-600">Total records</p>
              </div>

              {integrityReport && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Data Quality</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {integrityReport.dataQuality}%
                  </div>
                  <p className="text-sm text-green-600">Quality Score</p>
                  <div className="text-xs text-green-600 mt-1">
                    {integrityReport.missingData} fields with missing data
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Run test to see statistics
            </div>
          )}
        </div>
      </div>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upload History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Filename</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rows</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((upload, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{upload.filename}</td>
                    <td className="px-4 py-2 text-sm">{upload.total_rows?.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        upload.status === 'completed' ? 'bg-green-100 text-green-800' :
                        upload.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(upload.upload_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Structure Debug */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">CSV Structure Debug</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Expected Columns:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['ao', 'channel', 'date_created', 'workorder', 'hsa', 'branch', 'update_lapangan', 'symptom', 'tinjut_hd_oplang', 'kategori_manja', 'status_bima'].map((col) => (
                <div key={col} className="px-3 py-2 bg-blue-50 text-blue-800 rounded text-sm">
                  {col}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Column Mapping Issues:</h3>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>KATEGORI_MANJA:</strong> Seharusnya menampilkan text seperti &quot;lewat manja&quot;, bukan &quot;lebih dari 9 hari&quot;
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                <strong>STATUS_BIMA:</strong> Seharusnya menampilkan status, bukan waktu
              </p>
              <p className="text-sm text-yellow-800">
                <strong>Solusi:</strong> Periksa struktur CSV dan pastikan kolom ter-mapping dengan benar
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Debugging Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Upload CSV file baru</li>
              <li>Periksa console browser untuk melihat mapping kolom</li>
              <li>Pastikan nama kolom di CSV sesuai dengan yang diharapkan</li>
              <li>Jika masih salah, periksa struktur CSV yang sebenarnya</li>
            </ol>
          </div>

          {/* CSV Upload Test */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Test CSV Upload:</h3>
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const csv = event.target?.result as string
                    const lines = csv.split('\n')
                    const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, '')) || []
                    console.log('CSV Headers Found:', headers)
                    console.log('CSV Structure Analysis:', {
                      totalColumns: headers.length,
                      headers: headers,
                      firstRow: lines[1]?.split(',').map(c => c.trim().replace(/"/g, '')) || []
                    })
                  }
                  reader.readAsText(file)
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-600 mt-2">
              Upload CSV untuk melihat struktur kolom yang sebenarnya di console browser
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Troubleshooting:</h4>
        <ul className="text-sm space-y-1">
          <li>• Make sure you have a <code>.env.local</code> file in your project root</li>
          <li>• Restart your development server after adding environment variables</li>
          <li>• Check that your Supabase project is active and accessible</li>
          <li>• Verify your API keys are correct</li>
          <li>• Ensure database tables are created using the SQL script</li>
        </ul>
      </div>
    </div>
  )
}
