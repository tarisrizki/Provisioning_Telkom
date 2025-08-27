import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSV Column Validation Utilities
export interface ColumnMapping {
  orderIdIndex: number
  channelIndex: number
  dateIndex: number
  workOrderIndex: number
  serviceAreaIndex: number
  branchIndex: number
  updateLapanganIndex: number
  symptomIndex: number
  tinjutIndex: number
  statusIndex: number
}

export function validateCSVStructure(headers: string[]): {
  isValid: boolean
  missingColumns: string[]
  availableColumns: string[]
  columnMapping: ColumnMapping
} {
  const expectedColumns = [
    "ORDER_ID", "CHANNEL", "DATE_CREATED", "WORKORDER", "SERVICE_AREA", "BRANCH", 
    "UPDATE_LAPANGAN", "SYMPTOM", "TINJUT_HD_OPLANG", "STATUS_BIMA"
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
  const orderIdIndex = findColumnIndex(["ORDER_ID", "order_id", "Order ID", "AO", "ao", "Ao"])
  const channelIndex = findColumnIndex(["CHANNEL", "channel", "Channel"])
  const dateIndex = findColumnIndex(["DATE_CREATED", "date_created", "DATE", "date", "Date Created"])
  const workOrderIndex = findColumnIndex(["WORKORDER", "workorder", "WORK_ORDER", "work_order", "WO", "wo"])
  const serviceAreaIndex = findColumnIndex(["SERVICE_AREA", "service_area", "SERVICE AREA", "service area", "HSA", "hsa", "Hsa"])
  const branchIndex = findColumnIndex(["BRANCH", "branch", "Branch"])
  const updateLapanganIndex = findColumnIndex(["UPDATE_LAPANGAN", "update_lapangan", "UPDATE LAPANGAN", "update lapangan"])
  const symptomIndex = findColumnIndex(["SYMPTOM", "symptom", "Symptom"])
  const tinjutIndex = findColumnIndex(["TINJUT_HD_OPLANG", "tinjut_hd_oplang", "TINJUT HD OPLANG", "tinjut hd oplang"])
  let statusIndex = findColumnIndex(["STATUS_BIMA", "status_bima", "STATUS BIMA", "status bima"])

  // Log the mapping for debugging
  console.log("Column Mapping:", {
    orderIdIndex,
    channelIndex,
    dateIndex,
    workOrderIndex,
    serviceAreaIndex,
    branchIndex,
    updateLapanganIndex,
    symptomIndex,
    tinjutIndex,
    statusIndex,
    headers: headers
  })

  // Fallback: If any critical columns are not found, try sequential mapping
  if (statusIndex === -1) {
    console.warn("⚠️ Critical columns not found, using sequential fallback")
    
    // Try to find columns by position or partial matches
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
    orderIdIndex, channelIndex, dateIndex, workOrderIndex, serviceAreaIndex, branchIndex,
    updateLapanganIndex, symptomIndex, tinjutIndex, statusIndex
  }
}

export function mapCSVToLaporan(csvData: { headers: string[], rows: string[][] }): {
  headers: string[]
  rows: string[][]
} {
  const columnMapping = createColumnMapping(csvData.headers)
  
  const laporanHeaders = [
    "ORDER_ID", "CHANNEL", "DATE_CREATED", "WORKORDER", "SERVICE_AREA", "BRANCH", 
    "UPDATE_LAPANGAN", "SYMPTOM", "TINJUT_HD_OPLANG", "STATUS_BIMA"
  ]
  
  // Simple mapping without excessive logging
  const laporanRows = csvData.rows.map((row, rowIndex) => {
    const mappedRow = [
      columnMapping.orderIdIndex >= 0 ? (row[columnMapping.orderIdIndex] || "") : "",
      columnMapping.channelIndex >= 0 ? (row[columnMapping.channelIndex] || "") : "",
      columnMapping.dateIndex >= 0 ? (row[columnMapping.dateIndex] || "") : "",
      columnMapping.workOrderIndex >= 0 ? (row[columnMapping.workOrderIndex] || "") : "",
      columnMapping.serviceAreaIndex >= 0 ? (row[columnMapping.serviceAreaIndex] || "") : "",
      columnMapping.branchIndex >= 0 ? (row[columnMapping.branchIndex] || "") : "",
      columnMapping.updateLapanganIndex >= 0 ? (row[columnMapping.updateLapanganIndex] || "") : "",
      columnMapping.symptomIndex >= 0 ? (row[columnMapping.symptomIndex] || "") : "",
      columnMapping.tinjutIndex >= 0 ? (row[columnMapping.tinjutIndex] || "") : "",
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

// Note: Storage utilities have been removed as the application now uses Supabase database
// All data is now stored and retrieved from the cloud database instead of local storage
