import { useState, useCallback, useRef } from "react"
import { validateCSVStructure } from "@/lib/utils"

interface CSVData {
  headers: string[]
  rows: string[][]
}

interface UploadProgress {
  bytesProcessed: number
  totalBytes: number
  rowsProcessed: number
  currentChunk: number
  totalChunks: number
  processingTime: number
}

export function useUpload() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [fileName, setFileName] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [storageWarning, setStorageWarning] = useState("")
  
  const [parsingProgress, setParsingProgress] = useState<UploadProgress>({
    bytesProcessed: 0,
    totalBytes: 0,
    rowsProcessed: 0,
    currentChunk: 0,
    totalChunks: 0,
    processingTime: 0
  })
  
  const [performanceMetrics, setPerformanceMetrics] = useState({
    parsingSpeed: 0,
    memoryUsage: 0,
    chunkSize: 0
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  // Enhanced CSV parser for large files with streaming
  const parseCSV = useCallback(async (text: string): Promise<CSVData> => {
    const startTime = performance.now()
    const lines = text.trim().split('\n')
    
    if (lines.length < 2) {
      throw new Error("CSV must have at least headers and one data row")
    }

    // Parse headers with proper CSV handling
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      let i = 0
      
      while (i < line.length) {
        const char = line[i]
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Handle escaped quotes
            current += '"'
            i += 2
          } else {
            // Toggle quote state
            inQuotes = !inQuotes
            i++
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          result.push(current.trim())
          current = ''
          i++
        } else {
          current += char
          i++
        }
      }
      
      // Add the last field
      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0])
    if (headers.length === 0) {
      throw new Error("CSV headers are invalid")
    }

    console.log(`Parsing CSV: ${lines.length - 1} rows, ${headers.length} columns`)
    
    const totalRows = lines.length - 1
    const chunkSize = Math.max(1000, Math.floor(totalRows / 10)) // Dynamic chunk size
    const totalChunks = Math.ceil(totalRows / chunkSize)
    const allRows: string[][] = []
    let processedRows = 0

    console.log(`Using chunk size: ${chunkSize}, total chunks: ${totalChunks}`)

    // Process data in chunks for memory efficiency
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Parsing cancelled")
      }

      const startRow = chunkIndex * chunkSize + 1
      const endRow = Math.min((chunkIndex + 1) * chunkSize + 1, lines.length)
      const chunkLines = lines.slice(startRow, endRow)
      
      // Process chunk with progress update
      const chunkRows = chunkLines.map((line, index) => {
        const parsedRow = parseCSVLine(line)
        
        // Ensure row has same number of columns as headers
        if (parsedRow.length !== headers.length) {
          console.warn(`Row ${startRow + index} has ${parsedRow.length} columns, expected ${headers.length}. Padding with empty strings.`)
          // Pad with empty strings to match header count
          while (parsedRow.length < headers.length) {
            parsedRow.push('')
          }
          // Truncate if too many columns
          if (parsedRow.length > headers.length) {
            parsedRow.splice(headers.length)
          }
        }
        
        return parsedRow
      })

      allRows.push(...chunkRows)
      processedRows += chunkRows.length

      // Update progress
      const currentTime = performance.now()
      const processingTime = currentTime - startTime
      const parsingSpeed = processedRows / (processingTime / 1000) // rows per second

      setParsingProgress(prev => ({
        ...prev,
        rowsProcessed: processedRows,
        currentChunk: chunkIndex + 1,
        totalChunks,
        processingTime
      }))

      setPerformanceMetrics(prev => ({
        ...prev,
        parsingSpeed,
        chunkSize
      }))

      // Yield control to prevent blocking UI
      if (chunkIndex % 3 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime
    const avgSpeed = totalRows / (totalTime / 1000)

    console.log(`CSV Parsing Complete: ${totalRows} rows in ${totalTime.toFixed(2)}ms (${avgSpeed.toFixed(0)} rows/sec)`)

    // Validate data integrity
    const totalCells = headers.length * allRows.length
    const nonEmptyCells = allRows.flat().filter(cell => cell !== '').length
    
    console.log(`CSV Parsing Summary:`)
    console.log(`- Headers: ${headers.length}`)
    console.log(`- Rows: ${allRows.length}`)
    console.log(`- Total cells: ${totalCells}`)
    console.log(`- Non-empty cells: ${nonEmptyCells}`)
    console.log(`- Data integrity: ${((nonEmptyCells / totalCells) * 100).toFixed(2)}%`)
    console.log(`- Processing speed: ${avgSpeed.toFixed(0)} rows/sec`)
    console.log(`- Chunk size used: ${chunkSize}`)

    return { headers, rows: allRows }
  }, [])

  // Enhanced storage with IndexedDB for large files and localStorage fallback
  const storeData = useCallback(async (data: CSVData): Promise<void> => {
    const jsonData = JSON.stringify(data)
    const dataSizeMB = jsonData.length / 1024 / 1024
    
    console.log(`Storing data: ${dataSizeMB.toFixed(2)}MB, ${data.rows.length} rows`)
    
    try {
      // For large files (>5MB), use IndexedDB
      if (dataSizeMB > 5) {
        setStorageWarning("Large file detected. Using IndexedDB for better performance.")
        
        // Try IndexedDB first
        try {
          await storeInIndexedDB(data)
          console.log("Data stored successfully in IndexedDB")
          return
        } catch (indexedDBError) {
          console.warn("IndexedDB failed, falling back to chunked localStorage:", indexedDBError)
          setStorageWarning("IndexedDB unavailable. Using chunked localStorage as fallback.")
        }
      }
      
      // Fallback to localStorage (direct or chunked)
      if (dataSizeMB > 2) {
        // Use chunked localStorage for medium files
        await storeInChunkedLocalStorage(data)
        console.log("Data stored in chunked localStorage")
      } else {
        // Use direct localStorage for small files
        localStorage.setItem("uploadedCSVData", jsonData)
        console.log("Data stored directly in localStorage")
      }
      
    } catch (error) {
      console.error("Failed to store data:", error)
      throw new Error(`Storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [])

  // Store data in IndexedDB
  const storeInIndexedDB = async (data: CSVData): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CSVStorage', 1)
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'))
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        try {
          const transaction = db.transaction(['csvData'], 'readwrite')
          const objectStore = transaction.objectStore('csvData')
          
          // Store the entire dataset
          const storeRequest = objectStore.put({
            id: 'current',
            headers: data.headers,
            rows: data.rows,
            timestamp: Date.now(),
            totalRows: data.rows.length
          })
          
          storeRequest.onsuccess = () => resolve()
          storeRequest.onerror = () => reject(new Error('Failed to store in IndexedDB'))
          
        } catch (error) {
          reject(error)
        }
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains('csvData')) {
          const objectStore = db.createObjectStore('csvData', { keyPath: 'id' })
          objectStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  // Store data in chunked localStorage
  const storeInChunkedLocalStorage = async (data: CSVData): Promise<void> => {
    // Store metadata
    const metadata = {
      headers: data.headers,
      totalRows: data.rows.length,
      timestamp: Date.now(),
      storageType: 'chunked'
    }
    localStorage.setItem("uploadedCSVData_metadata", JSON.stringify(metadata))
    
    // Store in chunks of 500 rows (smaller chunks for better compatibility)
    const chunkSize = 500
    const totalChunks = Math.ceil(data.rows.length / chunkSize)
    
    for (let i = 0; i < totalChunks; i++) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Storage cancelled")
      }
      
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, data.rows.length)
      const chunk = data.rows.slice(start, end)
      
      try {
        localStorage.setItem(`uploadedCSVData_chunk_${i}`, JSON.stringify(chunk))
      } catch (chunkError) {
        console.error(`Failed to store chunk ${i}:`, chunkError)
        throw new Error(`Failed to store chunk ${i}: localStorage quota exceeded`)
      }
      
      // Update progress
      setParsingProgress(prev => ({
        ...prev,
        currentChunk: i + 1,
        totalChunks
      }))
      
      // Yield control every 3 chunks
      if (i % 3 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
    
    // Store chunk count
    localStorage.setItem("uploadedCSVData_chunkCount", totalChunks.toString())
    console.log(`Data stored in ${totalChunks} chunks`)
  }

  const handleParsedData = useCallback(async (parsedData: CSVData) => {
    if (parsedData.headers.length === 0 || parsedData.rows.length === 0) {
      setErrorMessage("CSV data appears to be empty or invalid")
      return
    }
    
    // Data integrity validation
    const validateDataIntegrity = (data: CSVData): boolean => {
      const expectedColumns = data.headers.length
      const allRowsHaveCorrectColumns = data.rows.every((row, index) => {
        if (row.length !== expectedColumns) {
          console.error(`Row ${index + 1} has ${row.length} columns, expected ${expectedColumns}`)
          return false
        }
        return true
      })
      
      if (!allRowsHaveCorrectColumns) {
        console.error("Data integrity check failed: Column count mismatch")
        return false
      }
      
      // Check for any completely empty rows
      const emptyRows = data.rows.filter(row => row.every(cell => cell === ''))
      if (emptyRows.length > 0) {
        console.warn(`Found ${emptyRows.length} completely empty rows`)
      }
      
      return true
    }
    
    // Validate data integrity
    if (!validateDataIntegrity(parsedData)) {
      setErrorMessage("CSV data integrity check failed. Please check your file.")
      return
    }
    
    // Validate CSV structure for laporan compatibility
    const validation = validateCSVStructure(parsedData.headers)
    
    if (!validation.isValid) {
      console.warn("CSV missing expected columns:", validation.missingColumns)
      console.warn("Available columns:", validation.availableColumns)
      console.log("Column mapping:", validation.columnMapping)
    }
    
    // Log detailed data for verification
    console.log("=== CSV DATA VERIFICATION ===")
    console.log("Headers:", parsedData.headers)
    console.log("First 3 rows:", parsedData.rows.slice(0, 3))
    console.log("Last 3 rows:", parsedData.rows.slice(-3))
    console.log("Total data cells:", parsedData.headers.length * parsedData.rows.length)
    console.log("=============================")
    
    setCsvData(parsedData)
    
    // Store data
    try {
      await storeData(parsedData)
      
      // Dispatch custom event to notify dashboard of data update
      window.dispatchEvent(new CustomEvent('csvDataUpdated'))
      
    } catch (storageError) {
      console.error("Failed to store data:", storageError)
      setErrorMessage("Failed to store data. File may be too large.")
      // Continue without storing - data is still available in component state
    }
  }, [storeData])

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          setParsingProgress(prev => ({
            ...prev,
            bytesProcessed: event.loaded
          }))
        }
      }
      
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      
      reader.readAsText(file)
    })
  }

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrorMessage("Please upload a valid CSV file")
      return
    }

    // Check file size limit (50MB for large files)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("File size exceeds 50MB limit. Please use a smaller file.")
      return
    }

    console.log(`Processing file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    
    setFileName(file.name)
    setErrorMessage("")
    setStorageWarning("")
    setUploadStatus("idle")
    setIsParsing(true)
    
    // Initialize progress tracking
    setParsingProgress({
      bytesProcessed: 0,
      totalBytes: file.size,
      rowsProcessed: 0,
      currentChunk: 0,
      totalChunks: 0,
      processingTime: 0
    })
    
    setPerformanceMetrics({
      parsingSpeed: 0,
      memoryUsage: 0,
      chunkSize: 0
    })

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    try {
      const text = await readFileAsText(file)
      
      if (!text || text.trim() === '') {
        setErrorMessage("CSV file is empty")
        setIsParsing(false)
        return
      }
      
      // Parse CSV with streaming optimization
      const parsedData = await parseCSV(text)
      await handleParsedData(parsedData)
      
    } catch (error) {
      if (error instanceof Error && error.message === "Parsing cancelled") {
        console.log("File processing cancelled by user")
        setErrorMessage("File processing cancelled")
      } else {
        console.error("CSV processing error:", error)
        setErrorMessage(error instanceof Error ? error.message : "Error processing CSV file")
      }
    } finally {
      setIsParsing(false)
      abortControllerRef.current = null
    }
  }, [parseCSV, handleParsedData])

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsParsing(false)
      setErrorMessage("File processing cancelled")
    }
  }, [])

  const clearFile = () => {
    setCsvData(null)
    setFileName("")
    setUploadStatus("idle")
    setErrorMessage("")
    setStorageWarning("")
    setShowPreview(false)
    setParsingProgress({
      bytesProcessed: 0,
      totalBytes: 0,
      rowsProcessed: 0,
      currentChunk: 0,
      totalChunks: 0,
      processingTime: 0
    })
    setPerformanceMetrics({
      parsingSpeed: 0,
      memoryUsage: 0,
      chunkSize: 0
    })
  }

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
    setErrorMessage("")

    try {
      // Dynamic import to avoid build-time issues
      const { DatabaseService } = await import("@/lib/database")
      
      // Process CSV data and upload to Supabase
      const result = await DatabaseService.processCSVData(csvData, fileName)
      
      if (result.success) {
        setUploadStatus("success")
        setShowPreview(false)
        setCsvData(null)
        setFileName("")
        
        // Dispatch custom event to notify dashboard of data update
        window.dispatchEvent(new CustomEvent('csvDataUpdated'))
        
        console.log(`Successfully uploaded ${result.insertedCount} work orders to database`)
      } else {
        setUploadStatus("error")
        setErrorMessage(result.error || "Failed to upload data to database")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload data")
    } finally {
      setUploading(false)
    }
  }

  return {
    // State
    csvData,
    fileName,
    isParsing,
    parsingProgress,
    showPreview,
    isUploading,
    uploadStatus,
    errorMessage,
    storageWarning,
    performanceMetrics,
    
    // Actions
    setShowPreview,
    handleFileUpload,
    handleDragOver,
    handleDrop,
    handleFileInput,
    handleSubmit,
    clearFile,
    cancelProcessing
  }
}
