interface CSVData {
  headers: string[]
  rows: string[][]
}

interface DataPreviewProps {
  csvData: CSVData
}

export function DataPreview({ csvData }: DataPreviewProps) {
  const previewRows = csvData.rows.slice(0, 10) // Show first 10 rows
  
  // Data integrity checks
  const totalCells = csvData.headers.length * csvData.rows.length
  const nonEmptyCells = csvData.rows.flat().filter(cell => cell !== '').length
  const dataIntegrityPercentage = ((nonEmptyCells / totalCells) * 100).toFixed(2)
  
  // Check for any data anomalies
  const hasEmptyRows = csvData.rows.some(row => row.every(cell => cell === ''))
  const hasInconsistentColumns = csvData.rows.some(row => row.length !== csvData.headers.length)
  const hasSpecialCharacters = csvData.rows.some(row => 
    row.some(cell => /[^\w\s\-_.,@#$%&*()+=<>?[\]{}|\\/:;'"`~!]/.test(cell))
  )

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Data Preview & Integrity Check</h3>
        <div className="text-sm text-gray-400">
          {csvData.rows.length.toLocaleString()} rows • {csvData.headers.length} columns
        </div>
      </div>
      
      {/* Data Integrity Summary */}
      <div className="bg-[#1B2431] border border-[#334155] rounded-lg p-4 mb-6">
        <h4 className="text-white font-medium mb-3">Data Integrity Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Rows:</span>
            <span className="text-white ml-2">{csvData.rows.length.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Total Columns:</span>
            <span className="text-white ml-2">{csvData.headers.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Data Integrity:</span>
            <span className={`ml-2 ${parseFloat(dataIntegrityPercentage) > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
              {dataIntegrityPercentage}%
            </span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className={`ml-2 ${!hasEmptyRows && !hasInconsistentColumns ? 'text-green-400' : 'text-yellow-400'}`}>
              {!hasEmptyRows && !hasInconsistentColumns ? '✓ Valid' : '⚠ Check'}
            </span>
          </div>
        </div>
        
        {/* Integrity Warnings */}
        {(hasEmptyRows || hasInconsistentColumns || hasSpecialCharacters) && (
          <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <h5 className="text-yellow-400 font-medium mb-2">⚠ Data Anomalies Detected:</h5>
            <ul className="text-yellow-300 text-sm space-y-1">
              {hasEmptyRows && <li>• Found completely empty rows</li>}
              {hasInconsistentColumns && <li>• Some rows have different column counts</li>}
              {hasSpecialCharacters && <li>• Special characters detected in data</li>}
            </ul>
          </div>
        )}
      </div>
      
      {/* Raw Data Preview */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Raw CSV Data Preview (First 10 Rows)</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1B2431]">
              <tr>
                {csvData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-left text-sm font-medium text-white border-r border-[#334155] last:border-r-0"
                  >
                    <div className="flex flex-col">
                      <span>{header}</span>
                      <span className="text-xs text-gray-400">Col {index + 1}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#334155] last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 text-sm text-white border-r border-[#334155] last:border-r-0"
                    >
                      <div className="max-w-xs truncate" title={cell}>
                        {cell || <span className="text-gray-500 italic">empty</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {csvData.rows.length > 10 && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            Showing first 10 rows of {csvData.rows.length.toLocaleString()} total rows
          </p>
        )}
      </div>

      {/* Data Statistics */}
      <div className="bg-[#1B2431] border border-[#334155] rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Data Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Cells:</span>
            <span className="text-white ml-2">{totalCells.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Non-Empty Cells:</span>
            <span className="text-white ml-2">{nonEmptyCells.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Empty Cells:</span>
            <span className="text-white ml-2">{(totalCells - nonEmptyCells).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">File Size:</span>
            <span className="text-white ml-2">
              {csvData.rows.length > 0 ? 
                `${((JSON.stringify(csvData).length / 1024 / 1024).toFixed(2))} MB` : 
                '0 MB'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
