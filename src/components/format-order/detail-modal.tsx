"use client"

import { useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as XLSX from 'xlsx'

import { FormatOrder } from "@/lib/supabase"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: FormatOrder | null
}

export function DetailModal({ isOpen, onClose, orderData }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState("detail-customer")
  const [isExporting, setIsExporting] = useState(false)
  // Pagination per main tab; each page holds up to 9 cards
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({
    "detail-customer": 0,
    "aktivasi": 0,
    "update-lapangan": 0,
    "manja": 0,
  })

  // Ensure default tab is Detail Customer whenever modal opens or order changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("detail-customer")
      setPageByTab({
        "detail-customer": 0,
        "aktivasi": 0,
        "update-lapangan": 0,
        "manja": 0,
      })
    }
  }, [isOpen, orderData?.order_id])

  // Export current order detail to Excel
  const exportCurrentDetail = async () => {
    if (!orderData) {
      alert('No data to export')
      return
    }

    setIsExporting(true)
    try {
      // Define Excel data based on all order fields
      const excelData = [
        ['Field', 'Value'],
        ['Order ID', orderData.order_id || '-'],
        ['Channel', orderData.channel || '-'],
        ['Date Created', orderData.date_created ? new Date(orderData.date_created).toLocaleString('id-ID') : '-'],
        ['Work Order', orderData.workorder || '-'],
        ['Service NO', orderData.service_no || '-'],
        ['Description', orderData.description || '-'],
        ['Address', orderData.address || '-'],
        ['Customer Name', orderData.customer_name || '-'],
        ['Work Zone', orderData.workzone || '-'],
        ['Tanggal PS', orderData.tanggal_ps ? new Date(orderData.tanggal_ps).toLocaleString('id-ID') : '-'],
        ['Status Date', orderData.status_date ? new Date(orderData.status_date).toLocaleString('id-ID') : '-'],
        ['Contact Phone', orderData.contact_phone || '-'],
        ['ODP', orderData.odp || '-'],
        ['Mitra', orderData.mitra || '-'],
        ['Labor Teknisi', orderData.labor_teknisi || '-'],
        ['SYMPTOM', orderData.symptom || '-'],
        ['TINJUT HD OPLANG', orderData.tinjut_hd_oplang || '-'],
        ['Keterangan HD OPLANG', orderData.keterangan_hd_oplang || '-'],
        ['SUBERRORCODE', orderData.suberrorcode || '-'],
        ['UIC', orderData.uic || '-'],
        ['Update UIC', orderData.update_uic || '-'],
        ['Keterangan UIC', orderData.keterangan_uic || '-'],
        ['Update Lapangan', orderData.update_lapangan || '-'],
        ['Engineering MEMO', orderData.engineering_memo || '-'],
        ['Status BIMA', orderData.status_bima || '-'],
        ['Booking Date', orderData.booking_date ? new Date(orderData.booking_date).toLocaleString('id-ID') : '-'],
      ]

      // Create workbook and worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      
      // Set column widths
      const colWidths = [
        { wch: 25 }, // Field column
        { wch: 50 }  // Value column
      ]
      ws['!cols'] = colWidths
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Order Detail')
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const filename = `order-detail-${orderData.order_id}-${timestamp}.xlsx`
      
      // Write file
      XLSX.writeFile(wb, filename)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  const tabs = [
    { id: "detail-customer", label: "Detail Customer" },
    { id: "aktivasi", label: "Aktivasi" },
    { id: "update-lapangan", label: "Update lapangan" },
    { id: "manja", label: "MANJA" }
  ]

  // Helper function to get display value or fallback
  const getDisplayValue = (value: string | undefined | null, fallback: string = '-') => {
    return value && value.trim() !== '' ? value : fallback
  }

  // Helper function to format date
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('id-ID')
    } catch {
      return dateString
    }
  }

  // Helper function to get status BIMA color
  const getStatusBimaColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-600'
    
    const statusUpper = status.toUpperCase()
    switch (statusUpper) {
      case 'STARTWORK':
        return 'bg-blue-600' // Blue for starting work
      case 'INSTCOMP':
        return 'bg-indigo-600' // Indigo for installation complete
      case 'ACTCOMP':
        return 'bg-purple-600' // Purple for activation complete
      case 'WORKFAIL':
        return 'bg-red-600' // Red for work failed
      case 'VALSTART':
        return 'bg-yellow-600' // Yellow for validation started
      case 'COMPWORK':
        return 'bg-orange-600' // Orange for completion work
      case 'COMPLETE':
        return 'bg-green-600' // Green for complete
      default:
        return 'bg-gray-600' // Default gray
    }
  }

  // Expandable text component to hide long content and reveal on click
  const ExpandableText = ({ text, maxLength = 60, className = "" }: { text: string | undefined | null, maxLength?: number, className?: string }) => {
    const [expanded, setExpanded] = useState(false)
    const safeText = getDisplayValue(text)
    if (safeText === '-') {
      return <span className={className}>-</span>
    }
    const isLong = safeText.length > maxLength
    const display = expanded || !isLong ? safeText : `${safeText.slice(0, maxLength)}...`
    return (
      <span className={className}>
        {display}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-xs px-2 py-0.5 rounded bg-[#334155] hover:bg-[#475569] border border-[#475569] text-gray-200"
          >
            {expanded ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        )}
      </span>
    )
  }

  // Line-clamp to 2 lines with "Selengkapnya" toggle
  const LineClampExpandable = ({ text, lines = 2, className = "" }: { text: string | undefined | null, lines?: number, className?: string }) => {
    const [expanded, setExpanded] = useState(false)
    const safe = getDisplayValue(text)
    if (safe === '-') return <span className={className}>-</span>
    return (
      <span className={className}>
        <span
          style={expanded ? {} : {
            display: '-webkit-box',
            WebkitLineClamp: String(lines),
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          } as React.CSSProperties}
        >
          {safe}
        </span>
        {safe && (
          <button onClick={() => setExpanded(!expanded)} className="ml-2 inline-flex text-xs px-2 py-0.5 rounded bg-[#334155] hover:bg-[#475569] border border-[#475569] text-gray-200">
            {expanded ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        )}
      </span>
    )
  }

  // Left info panel (Channel, Date created, Work order, SC Order No)
  const LeftPanel = () => (
    <div className="w-full md:w-1/3 space-y-6 md:space-y-8 text-left">
      <div>
        <p className="text-gray-400 text-xs font-medium">Channel</p>
        <h3 className="text-white font-semibold text-lg mt-1">{orderData?.channel || '-'}</h3>
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium">Date created</p>
        <p className="text-white font-semibold text-lg mt-1">{formatDate(orderData?.date_created)}</p>
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium">Work order</p>
        <p className="text-white font-semibold text-lg mt-1">{getDisplayValue(orderData?.workorder)}</p>
      </div>
      {/* <div>
        <p className="text-gray-400 text-xs font-medium">SC Order No</p>
        <div className="text-white font-semibold text-lg mt-1">
          <TruncatedText text={getDisplayValue(orderData?.sc_order_no)} maxLength={25} className="text-white font-semibold" />
        </div>
      </div> */}
    </div>
  )

  // Page layout with left panel + titled card. Supports either grouped slides or generic paging by 9.
  const PageWithLeftPanel = ({ title, fields, tabKey, groups }: { title: string, fields: Array<{ label: string, value: React.ReactNode }>, tabKey: string, groups?: Array<{ title: string, fields: Array<{ label: string, value: React.ReactNode }> }> }) => {
    const pageSize = 9
    const useGroups = Array.isArray(groups) && groups.length > 0
    const totalPages = useGroups ? groups!.length : Math.max(1, Math.ceil(fields.length / pageSize))
    const currentPage = Math.min(pageByTab[tabKey] ?? 0, totalPages - 1)
    const start = currentPage * pageSize
    const pageFields = useGroups ? groups![currentPage].fields : fields.slice(start, start + pageSize)
    const computedTitle = useGroups ? groups![currentPage].title : title
    const go = (delta: number) => setPageByTab((p) => ({ ...p, [tabKey]: Math.min(totalPages - 1, Math.max(0, (p[tabKey] ?? 0) + delta)) }))
    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <LeftPanel />
        <div className="flex-1 min-w-0">
          <div className="bg-[#1B2431] border border-[#475569] rounded-xl p-4 sm:p-6 w-full h-full">
            <h3 className="text-white text-lg font-bold mb-4">{computedTitle}</h3>
            <div className="max-h-[60vh] overflow-y-auto hide-scrollbar pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {pageFields.map((f, idx) => (
                  <div key={`${f.label}-${idx}`} className="bg-[#1B2431] rounded-lg p-3 sm:p-4 border border-[#475569]">
                    <p className="text-gray-300 text-sm font-medium mb-1">{f.label}</p>
                    <p className="text-white font-semibold">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button onClick={() => go(-1)} disabled={currentPage === 0} className="px-3 py-2 rounded-md text-sm bg-[#334155] hover:bg-[#475569] text-white border border-[#475569] disabled:opacity-40">Sebelumnya</button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span key={i} className={`w-2.5 h-2.5 rounded-full ${i === currentPage ? 'bg-blue-500' : 'bg-[#475569]'}`}></span>
                  ))}
                </div>
                <button onClick={() => go(1)} disabled={currentPage >= totalPages - 1} className="px-3 py-2 rounded-md text-sm bg-[#334155] hover:bg-[#475569] text-white border border-[#475569] disabled:opacity-40">Berikutnya</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderDetailContent = () => {
    if (!orderData) {
      return (
        <div className="text-center text-gray-400 py-8">
          No data available
        </div>
      )
    }

    switch (activeTab) {
      case "detail-customer":
        if (!orderData) return null
        // Group slides to match design images
        const slidesDC: Array<{ title: string, fields: Array<{ label: string, value: React.ReactNode }> }> = [
          {
            title: 'Detail Customer',
            fields: [
              { label: 'NO Service', value: getDisplayValue(orderData.service_no) },
              { label: 'Description', value: getDisplayValue(orderData.description) },
              { label: 'Address', value: <LineClampExpandable className="text-white font-semibold" text={orderData.address} lines={2} /> },
              { label: 'Customer Name', value: getDisplayValue(orderData.customer_name) },
              { label: 'Work Zone', value: getDisplayValue(orderData.workzone) },
              { label: 'Tanggal PS', value: formatDate(orderData.tanggal_ps) },
              { label: 'Status Date', value: formatDate(orderData.status_date) },
              { label: 'Contact PHO', value: getDisplayValue(orderData.contact_phone) },
              { label: 'ODP', value: getDisplayValue(orderData.odp) },
            ]
          },
          {
            title: 'Detail Customer',
            fields: [
              { label: 'Service Area', value: getDisplayValue(orderData?.service_area) },
              { label: 'Branch', value: getDisplayValue(orderData?.branch) },
              { label: 'Cluster', value: getDisplayValue(orderData?.cluster) },
              { label: 'Mitra', value: getDisplayValue(orderData?.mitra) || '> 9 HARI' },
            ]
          },
          {
            title: 'Tindak Lanjut',
            fields: [
              { label: 'TINJUT HD OPLANG', value: getDisplayValue(orderData.tinjut_hd_oplang) },
              { label: 'Keterangan HD OPLANG', value: <LineClampExpandable className="text-white font-semibold" text={orderData.keterangan_hd_oplang} lines={2} /> },
              { label: 'SUBERRORCODE', value: getDisplayValue(orderData.suberrorcode) },
              { label: 'UIC', value: getDisplayValue(orderData.uic) },
              { label: 'Update UIC', value: getDisplayValue(orderData.update_uic) },
              { label: 'Keterangan UIC', value: <LineClampExpandable className="text-white font-semibold" text={orderData.keterangan_uic} lines={2} /> },
              { label: 'Status BIMA', value: getDisplayValue(orderData.status_bima) },
              { label: 'Status DSC', value: getDisplayValue(orderData?.status_dsc) },
              { label: 'Status BIMA', value: getDisplayValue(orderData?.status_bima) },
            ]
          },
          {
            title: 'Manajemen Janji',
            fields: [
              { label: 'Umur MANJA', value: 'Umur > 3 hari' },
              { label: 'Kategori MANJA', value: 'Lewat MANJA' },
              { label: 'Sheet Aktivasi', value: getDisplayValue(orderData?.sheet_aktivasi) },
              { label: 'Tanggal PS', value: formatDate(orderData.tanggal_ps) },
            ]
          },
        ]
        return <PageWithLeftPanel title="Detail Customer" fields={slidesDC.flatMap(s => s.fields)} tabKey="detail-customer" groups={slidesDC} />

      case "aktivasi":
        const fieldsAkt = [
          { label: 'SYMPTOM:', value: getDisplayValue(orderData.symptom) },
          { label: 'Labor Teknisi:', value: <LineClampExpandable className="text-white font-semibold" text={orderData?.labor_teknisi || ''} lines={2} /> },
        ]
        return <PageWithLeftPanel title="Mitra" fields={fieldsAkt} tabKey="aktivasi" />



      case "update-lapangan":
        const fieldsUL = [
          { label: 'TINJUT HD OPLANG:', value: getDisplayValue(orderData.tinjut_hd_oplang) },
          { label: 'Keterangan HD OPLANG:', value: <ExpandableText className="text-white font-semibold" text={orderData.keterangan_hd_oplang} maxLength={80} /> },
          { label: 'SUBERRORCODE:', value: getDisplayValue(orderData.suberrorcode) },
          { label: 'UIC:', value: getDisplayValue(orderData.uic) },
          { label: 'Update UIC:', value: getDisplayValue(orderData.update_uic) },
          { label: 'Keterangan UIC:', value: <ExpandableText className="text-white font-semibold" text={orderData.keterangan_uic} maxLength={80} /> },
          { label: 'Update Lapangan:', value: getDisplayValue(orderData.update_lapangan) },
          { label: 'SYMPTOM:', value: getDisplayValue(orderData.symptom) },
          { label: 'Engineering MEMO:', value: <ExpandableText className="text-white font-semibold" text={orderData.engineering_memo} maxLength={80} /> },
          { label: 'Status BIMA', value: getDisplayValue(orderData.status_bima) },
          { label: 'Status DSC', value: getDisplayValue(orderData?.status_dsc) },
          { label: 'Status BIMA', value: getDisplayValue(orderData?.status_bima) },
        ]
        return <PageWithLeftPanel title="Update Lapangan" fields={fieldsUL} tabKey="update-lapangan" />

      case "manja":
        const fieldsManja = [
          { label: 'Umur MANJA', value: 'Umur > 3 hari' },
          { label: 'Kategori MANJA', value: 'Lewat MANJA' },
          { label: 'Booking date', value: formatDate(orderData.booking_date) },
        ]
        return <PageWithLeftPanel title="Manajemen Janji" fields={fieldsManja} tabKey="manja" />

      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      {/* Hidden scrollbar utility */}
      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-[#1e293b] rounded-none sm:rounded-lg w-full sm:max-w-6xl h-screen sm:h-auto max-h-[100svh] md:max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl border border-[#475569]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-6 border-b border-[#475569] bg-[#1B2431] sticky top-0 z-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="rounded-md bg-[#2a3444] text-white/90 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold tracking-wide">
                {orderData?.order_id || "No Order ID"}
              </span>
              <Badge className={`${getStatusBimaColor(orderData?.status_bima)} rounded-md text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold uppercase`}>
                {orderData?.status_bima || "UNKNOWN"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                onClick={exportCurrentDetail}
                disabled={isExporting}
                className="bg-[#334155] hover:bg-[#475569] text-white border border-[#475569] flex-1 sm:flex-none disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                <span className="sm:hidden">{isExporting ? 'Exporting...' : 'Export'}</span>
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-[#334155] flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tabs - Mobile Vertical Layout */}
          <div className="border-b border-[#475569] bg-[#1B2431] sticky top-[120px] sm:top-[72px] z-10">
            {/* Mobile: Vertical tabs */}
            <div className="block sm:hidden">
              <div className="w-full px-3 py-3">
                <div className="bg-gradient-to-b from-[#223048] to-[#2a3b55] rounded-xl p-2 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        if (tab.id === "detail-customer" || tab.id === "update-lapangan") {
                          setPageByTab((p) => ({ ...p, [tab.id]: 0 }))
                        }
                      }}
                      className={`w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg text-left ${
                        activeTab === tab.id
                          ? "text-white bg-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
                          : "text-gray-300 hover:text-white hover:bg-[#334155]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Horizontal tabs */}
            <div className="hidden sm:block">
              <div className="w-full px-4 sm:px-6 py-2">
                <div className="flex justify-center">
                  <div className="flex items-center bg-gradient-to-r from-[#223048] to-[#2a3b55] rounded-xl gap-30 p-1 px-80">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          if (tab.id === "detail-customer" || tab.id === "update-lapangan") {
                            setPageByTab((p) => ({ ...p, [tab.id]: 0 }))
                          }
                        }}
                        className={`px-3 sm:px-5 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
                          activeTab === tab.id
                            ? "text-white bg-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
                            : "text-gray-300 hover:text-white hover:bg-[#334155]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-3 sm:p-6 bg-[#1e293b] min-h-0">
            <div className="w-full">
              {renderDetailContent()}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

