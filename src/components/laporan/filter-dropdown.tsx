import { ChevronDown } from "lucide-react"

interface FilterDropdownProps {
  label: string
  value: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function FilterDropdown({ 
  label, 
  value, 
  isOpen, 
  onToggle, 
  children 
}: FilterDropdownProps) {
  return (
    <div className="relative filter-dropdown">
      <button
        onClick={onToggle}
        className="px-3 py-2 bg-[#1B2431] border border-[#334155] rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-[#334155] transition-colors"
      >
        <span>{value || label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg p-4 z-50 min-w-[280px]">
          {children}
        </div>
      )}
    </div>
  )
}
