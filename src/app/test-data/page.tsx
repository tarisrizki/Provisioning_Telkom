'use client'

import { useState, useEffect } from 'react'
import { DatabaseService } from '@/lib/database'

export default function TestDataPage() {
  const [rawData, setRawData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRawData = async () => {
    setIsLoading(true)
    try {
      const result = await DatabaseService.getWorkOrders({
        limit: 20,
        offset: 0
      })
      
      if (result.success && result.data) {
        setRawData(result.data)
        console.log('Raw data loaded:', result.data)
      } else {
        setError(result.error || 'Failed to load data')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRawData()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Raw Database Data Test</h1>
      
      <div className="mb-4">
        <button
          onClick={loadRawData}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {rawData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Raw Data from Database ({rawData.length} records)
            </h2>
            <p className="text-sm text-gray-600">
              Showing first 20 records to verify data integrity
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">AO</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Channel</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Work Order</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">HSA</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Branch</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Update Lapangan</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Symptom</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tinjut HD Oplang</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kategori Manja</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status Bima</th>
                </tr>
              </thead>
              <tbody>
                {rawData.map((record, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-mono">{record.ao}</td>
                    <td className="px-4 py-2 text-sm">{record.channel}</td>
                    <td className="px-4 py-2 text-sm">{record.date_created}</td>
                    <td className="px-4 py-2 text-sm">{record.workorder}</td>
                    <td className="px-4 py-2 text-sm">{record.hsa}</td>
                    <td className="px-4 py-2 text-sm">{record.branch}</td>
                    <td className="px-4 py-2 text-sm max-w-xs truncate">{record.update_lapangan}</td>
                    <td className="px-4 py-2 text-sm max-w-xs truncate">{record.symptom}</td>
                    <td className="px-4 py-2 text-sm max-w-xs truncate">{record.tinjut_hd_oplang}</td>
                    <td className="px-4 py-2 text-sm font-semibold bg-yellow-50 px-2 py-1 rounded">
                      {record.kategori_manja}
                    </td>
                    <td className="px-4 py-2 text-sm">{record.status_bima}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Data Verification:</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Kategori Manja</strong> should show original text like "LEWAT MANJA"</li>
          <li>• Check if there are any data transformations happening</li>
          <li>• Verify that CSV data is preserved exactly as uploaded</li>
        </ul>
      </div>

      {rawData.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Sample Kategori Manja Values:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from(new Set(rawData.map(r => r.kategori_manja))).slice(0, 8).map((kategori, index) => (
              <div key={index} className="bg-white p-2 rounded border text-sm">
                <span className="font-mono">{kategori}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
