"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle, AlertCircle, Download } from "lucide-react"

interface CSVData {
  headers: string[]
  rows: string[][]
}

export default function UploadPage() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [storageWarning, setStorageWarning] = useState("")
  const [parsingProgress, setParsingProgress] = useState(0)
  const [isParsing, setIsParsing] = useState(false)



  const parseCSV = (text: string): CSVData => {
    try {
      // Use more efficient string operations
      const lines = text.split('\n')
      const nonEmptyLines: string[] = []
      
      // Pre-allocate array size for better performance
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.trim() !== '') {
          nonEmptyLines.push(line)
        }
      }
      
      if (nonEmptyLines.length === 0) {
        throw new Error("CSV file is empty")
      }
      
      // Optimize header parsing
      const headerLine = nonEmptyLines[0]
      const headers = headerLine.split(',').map(header => header.trim().replace(/"/g, ''))
      
      if (headers.length === 0) {
        throw new Error("No headers found in CSV")
      }
      
      // Pre-allocate rows array for better performance
      const rows: string[][] = []
      const headerCount = headers.length
      
      // Process rows in chunks for better performance
      const chunkSize = 1000
      for (let i = 1; i < nonEmptyLines.length; i += chunkSize) {
        const chunk = nonEmptyLines.slice(i, i + chunkSize)
        
        for (const line of chunk) {
          const cells = line.split(',')
          const row: string[] = new Array(headerCount)
          
          // Fill cells efficiently
          for (let j = 0; j < headerCount; j++) {
            row[j] = j < cells.length ? cells[j].trim().replace(/"/g, '') : ''
          }
          
          // Only add non-empty rows
          if (row.some(cell => cell !== '')) {
            rows.push(row)
          }
        }
      }
      
      return { headers, rows }
    } catch (error) {
      console.error("CSV parsing error:", error)
      throw new Error("Invalid CSV format")
    }
  }

    const handleFileUpload = useCallback((file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrorMessage("Please upload a valid CSV file")
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage("File size must be less than 10MB")
      return
    }

    setFileName(file.name)
    setErrorMessage("")
    setUploadStatus("idle")
    setStorageWarning("")
    setIsParsing(true)
    setParsingProgress(0)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        
        if (!text || text.trim() === '') {
          setErrorMessage("CSV file is empty")
          setIsParsing(false)
          return
        }
        
        // Use Web Worker for parsing large files
        if (text.length > 100000) { // Use worker for files > 100KB
          const worker = new Worker(new URL('./worker.js', import.meta.url))
          const id = Date.now()
          
          worker.onmessage = (event) => {
            const { type, data, error, progress, id: messageId } = event.data
            
            if (messageId !== id) return
            
            if (type === 'progress') {
              setParsingProgress(progress)
            } else if (type === 'result') {
              handleParsedData(data)
              worker.terminate()
              setIsParsing(false)
            } else if (type === 'error') {
              setErrorMessage(error)
              setIsParsing(false)
              worker.terminate()
            }
          }
          
          worker.postMessage({ text, id })
        } else {
          // Use regular parsing for small files
          const parsedData = parseCSV(text)
          handleParsedData(parsedData)
          setIsParsing(false)
        }
      } catch (error) {
        console.error("CSV parsing error:", error)
        setErrorMessage(error instanceof Error ? error.message : "Error parsing CSV file")
        setIsParsing(false)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleParsedData = useCallback((parsedData: CSVData) => {
    if (parsedData.headers.length === 0 || parsedData.rows.length === 0) {
      setErrorMessage("CSV file appears to be empty or invalid")
      return
    }
    
    console.log("Parsed CSV data:", parsedData) // Debug log
    setCsvData(parsedData)
    
    // Save to localStorage for laporan page with error handling
    try {
      const jsonData = JSON.stringify(parsedData)
      
      // Check if data is too large (localStorage limit is usually 5-10MB)
      if (jsonData.length > 4 * 1024 * 1024) { // 4MB limit
        console.warn("CSV data is too large for localStorage, storing only first 1000 rows")
        setStorageWarning(`File is large (${(jsonData.length / 1024 / 1024).toFixed(1)}MB). Only first 1000 rows will be saved for reports.`)
        
        // Store only first 1000 rows to fit in localStorage
        const limitedData = {
          headers: parsedData.headers,
          rows: parsedData.rows.slice(0, 1000)
        }
        
        localStorage.setItem("uploadedCSVData", JSON.stringify(limitedData))
      } else {
        localStorage.setItem("uploadedCSVData", jsonData)
      }
    } catch (storageError) {
      console.error("Failed to save to localStorage:", storageError)
      // Continue without saving to localStorage - data is still available in component state
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleSubmit = async () => {
    if (!csvData) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUploadStatus("success")
      setShowPreview(false)
      setCsvData(null)
      setFileName("")
    } catch {
      setUploadStatus("error")
      setErrorMessage("Failed to upload data")
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setCsvData(null)
    setFileName("")
    setUploadStatus("idle")
    setErrorMessage("")
    setStorageWarning("")
    setShowPreview(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Data</h1>
        <p className="text-gray-400">
          Upload and manage your provisioning data via CSV files.
        </p>
      </div>

      {/* Upload Area */}
      <div className="rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg">
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-white">Import CSV File</h3>
          

          
          {!csvData ? (
            <div
              className="border-2 border-dashed border-[#475569] rounded-lg p-12 text-center hover:border-blue-400 transition-colors bg-[#0f172a]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-16 w-16 text-blue-400 mb-6" />
              <p className="text-xl font-medium text-white mb-3">
                Drag and drop to upload data (CSV) or import file from your computer
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors text-lg font-medium shadow-lg"
              >
                <FileText className="h-5 w-5 mr-2" />
                Import
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">{fileName}</p>
                    <p className="text-sm text-gray-400">
                      {csvData.rows.length} rows, {csvData.headers.length} columns
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Preview Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              {/* Preview Table */}
              {showPreview && (
                <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#0f172a]">
                  {/* Table Container with Horizontal Scroll */}
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb scrollbar-track">
                    <div className="inline-block min-w-full">
                      <table className="min-w-full divide-y divide-[#334155]">
                        <thead className="bg-[#1e293b]">
                          <tr>
                            {csvData.headers.map((header, index) => (
                              <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap bg-[#1e293b] min-w-[200px]"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-[#0f172a] divide-y divide-[#334155]">
                          {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[#1e293b] transition-colors">
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap min-w-[200px]"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Table Footer with Scroll Info */}
                  <div className="px-6 py-3 bg-[#1e293b] text-sm text-gray-400 text-center border-t border-[#334155]">
                    {csvData.rows.length > 5 ? (
                      <span>Showing first 5 rows of {csvData.rows.length} total rows</span>
                    ) : (
                      <span>All {csvData.rows.length} rows displayed</span>
                    )}
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="text-xs text-gray-500">💡</span>
                      <span className="text-xs text-gray-500">Slide horizontally to see all columns</span>
                      <span className="text-xs text-gray-500">← →</span>
                    </div>
                    {/* Scroll Bar Indicator */}
                    <div className="mt-3 flex justify-center">
                      <div className="w-32 h-2 bg-[#334155] rounded-full overflow-hidden">
                        <div className="w-8 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium shadow-lg"
                >
                  {isUploading ? "Uploading..." : "Upload Data"}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-300">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {storageWarning && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-yellow-300">{storageWarning}</p>
              </div>
            </div>
          )}
          
          {isParsing && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <p className="text-blue-300">Parsing CSV file...</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${parsingProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-300 text-sm mt-1">{Math.round(parsingProgress)}%</p>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === "success" && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-300">Data uploaded successfully!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">CSV Format Requirements</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• File must be in CSV format (.csv extension)</p>
            <p>• First row should contain column headers</p>
            <p>• Data should be comma-separated</p>
            <p>• Maximum file size: 10MB</p>
            <p>• Supported columns: Name, Email, Phone, Department, etc.</p>
          </div>
          
          {/* Download Sample */}
          <div className="mt-4 pt-4 border-t border-[#334155]">
            <p className="text-sm text-gray-400 mb-2">
              Need a sample file? Download our template:
            </p>
            <a
              href="/sample-data.csv"
              download
              className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
