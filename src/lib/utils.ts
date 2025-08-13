import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSV Column Validation Utilities
export interface ColumnMapping {
  aoIndex: number
  channelIndex: number
  dateIndex: number
  workOrderIndex: number
  hsaIndex: number
  branchIndex: number
  updateLapanganIndex: number
  symptomIndex: number
  tinjutIndex: number
  kategoriIndex: number
  statusIndex: number
}

export function validateCSVStructure(headers: string[]): {
  isValid: boolean
  missingColumns: string[]
  availableColumns: string[]
  columnMapping: ColumnMapping
} {
  const expectedColumns = [
    "AO", "CHANNEL", "DATE_CREATED", "WORKORDER", "HSA", "BRANCH", 
    "UPDATE_LAPANGAN", "SYMPTOM", "TINJUT_HD_OPLANG", "KATEGORI_MANJA", "STATUS_BIMA"
  ]
  
  const availableColumns = headers.map(h => h.trim())
  
  // Find missing columns
  const missingColumns = expectedColumns.filter(expected => 
    !availableColumns.some(header => 
      header.toLowerCase().replace(/[_-]/g, '') === expected.toLowerCase().replace(/[_-]/g, '')
    )
  )
  
  // Create column mapping
  const columnMapping = createColumnMapping(headers)
  
  return {
    isValid: missingColumns.length === 0,
    missingColumns,
    availableColumns,
    columnMapping
  }
}

export function createColumnMapping(headers: string[]): ColumnMapping {
  // Flexible column mapping that handles variations in header names
  const findColumnIndex = (possibleHeaders: string[]): number => {
    for (const header of possibleHeaders) {
      const index = headers.findIndex(h => 
        h.toLowerCase().trim() === header.toLowerCase().trim()
      )
      if (index !== -1) return index
    }
    return -1
  }

  // Map headers with multiple possible variations
  let aoIndex = findColumnIndex(["AO", "ao", "Ao"])
  let channelIndex = findColumnIndex(["CHANNEL", "channel", "Channel"])
  let dateIndex = findColumnIndex(["DATE_CREATED", "date_created", "DATE", "date", "Date Created"])
  let workOrderIndex = findColumnIndex(["WORKORDER", "workorder", "WORK_ORDER", "work_order", "WO", "wo"])
  let hsaIndex = findColumnIndex(["HSA", "hsa", "Hsa"])
  let branchIndex = findColumnIndex(["BRANCH", "branch", "Branch"])
  let updateLapanganIndex = findColumnIndex(["UPDATE_LAPANGAN", "update_lapangan", "UPDATE LAPANGAN", "update lapangan"])
  let symptomIndex = findColumnIndex(["SYMPTOM", "symptom", "Symptom"])
  let tinjutIndex = findColumnIndex(["TINJUT_HD_OPLANG", "tinjut_hd_oplang", "TINJUT HD OPLANG", "tinjut hd oplang"])
  let kategoriIndex = findColumnIndex(["KATEGORI_MANJA", "kategori_manja", "KATEGORI MANJA", "kategori manja"])
  let statusIndex = findColumnIndex(["STATUS_BIMA", "status_bima", "STATUS BIMA", "status bima"])

  // Log the mapping for debugging
  console.log("Column Mapping:", {
    aoIndex,
    channelIndex,
    dateIndex,
    workOrderIndex,
    hsaIndex,
    branchIndex,
    updateLapanganIndex,
    symptomIndex,
    tinjutIndex,
    kategoriIndex,
    statusIndex,
    headers: headers
  })

  // Fallback: If any critical columns are not found, try sequential mapping
  if (kategoriIndex === -1 || statusIndex === -1) {
    console.warn("⚠️ Critical columns not found, using sequential fallback")
    
    // Try to find columns by position or partial matches
    if (kategoriIndex === -1) {
      // Look for any column containing "kategori" or "manja"
      const fallbackKategori = headers.findIndex(h => 
        h.toLowerCase().includes('kategori') || h.toLowerCase().includes('manja')
      )
      if (fallbackKategori !== -1) {
        console.log("Found KATEGORI_MANJA at fallback index:", fallbackKategori)
        kategoriIndex = fallbackKategori
      }
    }
    
    if (statusIndex === -1) {
      // Look for any column containing "status" or "bima"
      const fallbackStatus = headers.findIndex(h => 
        h.toLowerCase().includes('status') || h.toLowerCase().includes('bima')
      )
      if (fallbackStatus !== -1) {
        console.log("Found STATUS_BIMA at fallback index:", fallbackStatus)
        statusIndex = fallbackStatus
      }
    }
  }
  
  return {
    aoIndex, channelIndex, dateIndex, workOrderIndex, hsaIndex, branchIndex,
    updateLapanganIndex, symptomIndex, tinjutIndex, kategoriIndex, statusIndex
  }
}

export function mapCSVToLaporan(csvData: { headers: string[], rows: string[][] }): {
  headers: string[]
  rows: string[][]
} {
  const columnMapping = createColumnMapping(csvData.headers)
  
  const laporanHeaders = [
    "AO", "CHANNEL", "DATE_CREATED", "WORKORDER", "HSA", "BRANCH", 
    "UPDATE_LAPANGAN", "SYMPTOM", "TINJUT_HD_OPLANG", "KATEGORI_MANJA", "STATUS_BIMA"
  ]
  
  // Simple mapping without excessive logging
  const laporanRows = csvData.rows.map((row, rowIndex) => {
    const mappedRow = [
      columnMapping.aoIndex >= 0 ? (row[columnMapping.aoIndex] || "") : "",
      columnMapping.channelIndex >= 0 ? (row[columnMapping.channelIndex] || "") : "",
      columnMapping.dateIndex >= 0 ? (row[columnMapping.dateIndex] || "") : "",
      columnMapping.workOrderIndex >= 0 ? (row[columnMapping.workOrderIndex] || "") : "",
      columnMapping.hsaIndex >= 0 ? (row[columnMapping.hsaIndex] || "") : "",
      columnMapping.branchIndex >= 0 ? (row[columnMapping.branchIndex] || "") : "",
      columnMapping.updateLapanganIndex >= 0 ? (row[columnMapping.updateLapanganIndex] || "") : "",
      columnMapping.symptomIndex >= 0 ? (row[columnMapping.symptomIndex] || "") : "",
      columnMapping.tinjutIndex >= 0 ? (row[columnMapping.tinjutIndex] || "") : "",
      columnMapping.kategoriIndex >= 0 ? (row[columnMapping.kategoriIndex] || "") : "",
      columnMapping.statusIndex >= 0 ? (row[columnMapping.statusIndex] || "") : ""
    ]
    
    // Log only first row for debugging
    if (rowIndex === 0) {
      console.log("First Row Mapping:", {
        original: {
          kategori: row[columnMapping.kategoriIndex] || "NOT_FOUND",
          status: row[columnMapping.statusIndex] || "NOT_FOUND"
        },
        mapped: {
          kategori: mappedRow[9],
          status: mappedRow[10]
        }
      })
    }
    
    return mappedRow
  })
  
  return { headers: laporanHeaders, rows: laporanRows }
}

// Data Integrity Verification Functions
export function verifyDataIntegrity(originalData: { headers: string[], rows: string[][] }, processedData: { headers: string[], rows: string[][] }): {
  isIntact: boolean
  issues: string[]
  statistics: {
    originalRows: number
    processedRows: number
    originalCells: number
    processedCells: number
    dataLossPercentage: number
  }
} {
  const issues: string[] = []
  
  // Check row count
  if (originalData.rows.length !== processedData.rows.length) {
    issues.push(`Row count mismatch: Original ${originalData.rows.length}, Processed ${processedData.rows.length}`)
  }
  
  // Check header count
  if (processedData.headers.length !== 11) { // Expected laporan columns
    issues.push(`Header count mismatch: Expected 11, Got ${processedData.headers.length}`)
  }
  
  // Check for data loss
  const originalCells = originalData.headers.length * originalData.rows.length
  const processedCells = processedData.headers.length * processedData.rows.length
  const dataLossPercentage = ((originalCells - processedCells) / originalCells) * 100
  
  if (dataLossPercentage > 0) {
    issues.push(`Data loss detected: ${dataLossPercentage.toFixed(2)}% of cells lost`)
  }
  
  // Check for empty data in processed rows
  const emptyCellsInProcessed = processedData.rows.flat().filter(cell => cell === "").length
  if (emptyCellsInProcessed > 0) {
    issues.push(`Empty cells in processed data: ${emptyCellsInProcessed} cells`)
  }
  
  return {
    isIntact: issues.length === 0,
    issues,
    statistics: {
      originalRows: originalData.rows.length,
      processedRows: processedData.rows.length,
      originalCells,
      processedCells,
      dataLossPercentage
    }
  }
}

export function generateDataIntegrityReport(csvData: { headers: string[], rows: string[][] }): {
  summary: string
  details: {
    totalRows: number
    totalColumns: number
    totalCells: number
    nonEmptyCells: number
    emptyCells: number
    dataIntegrityPercentage: number
    anomalies: string[]
  }
} {
  const totalCells = csvData.headers.length * csvData.rows.length
  const nonEmptyCells = csvData.rows.flat().filter(cell => cell !== '').length
  const emptyCells = totalCells - nonEmptyCells
  const dataIntegrityPercentage = ((nonEmptyCells / totalCells) * 100)
  
  const anomalies: string[] = []
  
  // Check for empty rows
  const emptyRows = csvData.rows.filter(row => row.every(cell => cell === ''))
  if (emptyRows.length > 0) {
    anomalies.push(`${emptyRows.length} completely empty rows`)
  }
  
  // Check for inconsistent column counts
  const inconsistentRows = csvData.rows.filter(row => row.length !== csvData.headers.length)
  if (inconsistentRows.length > 0) {
    anomalies.push(`${inconsistentRows.length} rows with inconsistent column count`)
  }
  
  // Check for very long cell values
  const longCells = csvData.rows.flat().filter(cell => cell.length > 1000)
  if (longCells.length > 0) {
    anomalies.push(`${longCells.length} cells with very long content (>1000 chars)`)
  }
  
  let summary = "Data integrity check completed"
  if (anomalies.length > 0) {
    summary += ` with ${anomalies.length} anomalies detected`
  } else {
    summary += " - No issues found"
  }
  
  return {
    summary,
    details: {
      totalRows: csvData.rows.length,
      totalColumns: csvData.headers.length,
      totalCells,
      nonEmptyCells,
      emptyCells,
      dataIntegrityPercentage,
      anomalies
    }
  }
}

// Storage utilities for unlimited CSV files
export async function readCSVDataFromStorage(): Promise<{ headers: string[], rows: string[][] } | null> {
  try {
    // Try localStorage first
    const localStorageData = localStorage.getItem("uploadedCSVData")
    if (localStorageData) {
      const parsed = JSON.parse(localStorageData)
      console.log("Data loaded from localStorage:", parsed.headers.length, "columns,", parsed.rows.length, "rows")
      return parsed
    }

    // Try IndexedDB for large files
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      try {
        const indexedDBData = await readFromIndexedDB()
        if (indexedDBData) {
          console.log("Data loaded from IndexedDB:", indexedDBData.headers.length, "columns,", indexedDBData.rows.length, "rows")
          return indexedDBData
        }
      } catch (indexedDBError) {
        console.warn("IndexedDB read failed:", indexedDBError)
      }
    }

    // Try chunked localStorage
    const chunkedData = await readFromChunkedStorage()
    if (chunkedData) {
      console.log("Data loaded from chunked storage:", chunkedData.headers.length, "columns,", chunkedData.rows.length, "rows")
      return chunkedData
    }

    return null
  } catch (error) {
    console.error("Failed to read CSV data from storage:", error)
    return null
  }
}

// Read from IndexedDB
async function readFromIndexedDB(): Promise<{ headers: string[], rows: string[][] } | null> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('CSVStorage', 1)
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'))
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        try {
          const transaction = db.transaction(['csvData'], 'readonly')
          const objectStore = transaction.objectStore('csvData')
          
          const getRequest = objectStore.get('current')
          
          getRequest.onsuccess = () => {
            const data = getRequest.result
            if (data && data.headers && data.rows) {
              resolve({
                headers: data.headers,
                rows: data.rows
              })
            } else {
              resolve(null)
            }
          }
          
          getRequest.onerror = () => reject(new Error('Failed to read from IndexedDB'))
          
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
    } catch (error) {
      reject(error)
    }
  })
}

// Read from chunked localStorage
async function readFromChunkedStorage(): Promise<{ headers: string[], rows: string[][] } | null> {
  try {
    const metadataStr = localStorage.getItem("uploadedCSVData_metadata")
    const chunkCountStr = localStorage.getItem("uploadedCSVData_chunkCount")
    
    if (!metadataStr || !chunkCountStr) {
      return null
    }
    
    const metadata = JSON.parse(metadataStr)
    const chunkCount = parseInt(chunkCountStr)
    
    if (!metadata.headers || !metadata.totalRows || chunkCount === 0) {
      return null
    }
    
    console.log(`Reading chunked data: ${metadata.totalRows} rows in ${chunkCount} chunks`)
    
    const allRows: string[][] = []
    
    // Read all chunks
    for (let i = 0; i < chunkCount; i++) {
      const chunkStr = localStorage.getItem(`uploadedCSVData_chunk_${i}`)
      if (!chunkStr) {
        console.warn(`Missing chunk ${i}`)
        continue
      }
      
      try {
        const chunk = JSON.parse(chunkStr)
        if (Array.isArray(chunk)) {
          allRows.push(...chunk)
        }
      } catch (parseError) {
        console.error(`Failed to parse chunk ${i}:`, parseError)
      }
      
      // Yield control for large files
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
    
    if (allRows.length === 0) {
      return null
    }
    
    if (allRows.length !== metadata.totalRows) {
      console.warn(`Row count mismatch: expected ${metadata.totalRows}, got ${allRows.length}`)
    }
    
    return {
      headers: metadata.headers,
      rows: allRows
    }
    
  } catch (error) {
    console.error("Failed to read from chunked storage:", error)
    return null
  }
}

// Clear all storage types
export async function clearAllCSVStorage(): Promise<void> {
  try {
    // Clear direct localStorage
    localStorage.removeItem("uploadedCSVData")
    
    // Clear chunked localStorage
    localStorage.removeItem("uploadedCSVData_metadata")
    localStorage.removeItem("uploadedCSVData_chunkCount")
    
    // Clear chunks
    let i = 0
    while (localStorage.getItem(`uploadedCSVData_chunk_${i}`)) {
      localStorage.removeItem(`uploadedCSVData_chunk_${i}`)
      i++
    }
    
    // Clear IndexedDB
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      try {
        const request = indexedDB.deleteDatabase('CSVStorage')
        request.onsuccess = () => console.log("IndexedDB cleared")
        request.onerror = () => console.warn("Failed to clear IndexedDB")
      } catch (indexedDBError) {
        console.warn("IndexedDB clear failed:", indexedDBError)
      }
    }
    
    console.log("All CSV storage cleared")
  } catch (error) {
    console.error("Failed to clear storage:", error)
  }
}

// Get storage info
export function getStorageInfo(): {
  hasDirectStorage: boolean
  hasChunkedStorage: boolean
  hasIndexedDB: boolean
  totalRows: number
  storageType: string
  storageSize: number
} {
  try {
    let hasDirectStorage = false
    let hasChunkedStorage = false
    let hasIndexedDB = false
    let totalRows = 0
    let storageType = 'none'
    let storageSize = 0
    
    // Check direct storage
    const directData = localStorage.getItem("uploadedCSVData")
    if (directData) {
      hasDirectStorage = true
      storageType = 'localStorage'
      try {
        const data = JSON.parse(directData)
        totalRows = data.rows?.length || 0
        storageSize = directData.length
      } catch (error) {
        console.warn("Failed to parse direct storage data")
      }
    }
    
    // Check chunked storage
    const metadataStr = localStorage.getItem("uploadedCSVData_metadata")
    const chunkCountStr = localStorage.getItem("uploadedCSVData_chunkCount")
    
    if (metadataStr && chunkCountStr) {
      hasChunkedStorage = true
      if (!hasDirectStorage) {
        storageType = 'chunked localStorage'
      }
      
      try {
        const metadata = JSON.parse(metadataStr)
        totalRows = metadata.totalRows || 0
        
        // Calculate chunked storage size
        const chunkCount = parseInt(chunkCountStr)
        for (let i = 0; i < chunkCount; i++) {
          const chunkData = localStorage.getItem(`uploadedCSVData_chunk_${i}`)
          if (chunkData) {
            storageSize += chunkData.length
          }
        }
        
        // Add metadata size
        storageSize += metadataStr.length + chunkCountStr.length
      } catch (error) {
        console.warn("Failed to parse chunked storage metadata")
      }
    }
    
    // Note: IndexedDB check requires async operation
    // For now, we'll assume it's not available if we have localStorage data
    if (!hasDirectStorage && !hasChunkedStorage) {
      // Could check IndexedDB here if needed
      hasIndexedDB = false
    }
    
    return {
      hasDirectStorage,
      hasChunkedStorage,
      hasIndexedDB,
      totalRows,
      storageType,
      storageSize
    }
    
  } catch (error) {
    console.error("Failed to get storage info:", error)
    return {
      hasDirectStorage: false,
      hasChunkedStorage: false,
      hasIndexedDB: false,
      totalRows: 0,
      storageType: 'error',
      storageSize: 0
    }
  }
}
