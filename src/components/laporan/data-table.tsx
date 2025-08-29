interface DataTableProps {
  headers: string[]
  rows: string[][]
  visibleRows: number
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export function DataTable({ headers, rows, visibleRows }: DataTableProps) {
  const visibleData = rows.slice(0, visibleRows)

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1B2431] border-b border-[#334155]">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium text-white border-r border-[#334155] last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[#334155] hover:bg-[#334155] transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-300 border-r border-[#334155] last:border-r-0"
                  >
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {rows.length > visibleRows && (
        <div className="p-4 text-center text-sm text-gray-400">
          Showing {visibleRows} of {rows.length} rows. Scroll to load more.
        </div>
      )}
    </div>
  )
}
