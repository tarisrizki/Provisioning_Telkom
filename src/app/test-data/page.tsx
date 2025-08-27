"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TestData {
  id: string
  name: string
  status: string
  timestamp: string
}

export default function TestDataPage() {
  const [testData, setTestData] = useState<TestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchTestData = async () => {
      try {
        setLoading(true)
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Data will be fetched from Supabase - no mock data
        const mockData: TestData[] = []
        
        setTestData(mockData)
        setError(null)
      } catch {
        setError("Failed to fetch test data")
      } finally {
        setLoading(false)
      }
    }

    fetchTestData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-600 text-white"
      case "failed":
        return "bg-red-600 text-white"
      case "pending":
        return "bg-yellow-600 text-black"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Success"
      case "failed":
        return "Failed"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading test data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Test Data</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Refresh Data
        </Button>
      </div>

      <Card className="bg-[#1e293b] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-white">Connection Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#334155] rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Tested at: {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e293b] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-white">Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Database URL
                </label>
                <input
                  type="text"
                  className="w-full bg-[#334155] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter database URL"
                  defaultValue="postgresql://localhost:5432/testdb"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Connection Timeout
                </label>
                <input
                  type="number"
                  className="w-full bg-[#334155] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="30"
                  defaultValue="30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Test Query
              </label>
              <textarea
                className="w-full bg-[#334155] border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                placeholder="SELECT 1;"
                defaultValue="SELECT 1;"
              />
            </div>
            <div className="flex space-x-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Run Test
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e293b] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-white">Test History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Last 24 hours: 0 tests</span>
              <span>Success rate: 0%</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Last 7 days: 0 tests</span>
              <span>Success rate: 0%</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Last 30 days: 0 tests</span>
              <span>Success rate: 0%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
