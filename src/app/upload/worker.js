// CSV parsing worker for better performance
self.onmessage = function(e) {
  const { text, id } = e.data
  
  try {
    // Use more efficient string operations
    const lines = text.split('\n')
    const nonEmptyLines = []
    
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
    const rows = []
    const headerCount = headers.length
    
    // Process rows in chunks for better performance
    const chunkSize = 1000
    for (let i = 1; i < nonEmptyLines.length; i += chunkSize) {
      const chunk = nonEmptyLines.slice(i, i + chunkSize)
      
      for (const line of chunk) {
        const cells = line.split(',')
        const row = new Array(headerCount)
        
        // Fill cells efficiently
        for (let j = 0; j < headerCount; j++) {
          row[j] = j < cells.length ? cells[j].trim().replace(/"/g, '') : ''
        }
        
        // Only add non-empty rows
        if (row.some(cell => cell !== '')) {
          rows.push(row)
        }
      }
      
      // Send progress update
      if (i % (chunkSize * 10) === 0) {
        self.postMessage({
          type: 'progress',
          progress: Math.min((i / nonEmptyLines.length) * 100, 100),
          id
        })
      }
    }
    
    // Send result
    self.postMessage({
      type: 'result',
      data: { headers, rows },
      id
    })
    
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message,
      id
    })
  }
}
