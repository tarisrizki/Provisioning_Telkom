"use client"

import { useState } from "react"
import { X, Download, Plus, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FormatOrder } from "@/lib/supabase"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: FormatOrder | null
}

export function DetailModal({ isOpen, onClose, orderData }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState("detail-customer")
  const [copiedText, setCopiedText] = useState<string | null>(null)

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

  // Helper function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Helper function to truncate text with tooltip
  const TruncatedText = ({ text, maxLength = 30, className = "" }: { text: string, maxLength?: number, className?: string }) => {
    if (!text || text.length <= maxLength) {
      return <span className={className}>{text}</span>
    }

    const isCopied = copiedText === text

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${className} cursor-help hover:text-blue-400 transition-colors duration-200 relative group`}>
            {text.substring(0, maxLength)}...
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-lg bg-gradient-to-br from-[#1e293b] to-[#334155] border border-[#475569] shadow-2xl rounded-xl p-4 backdrop-blur-sm"
          side="top"
          sideOffset={8}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Full Text</span>
              </div>
              <button
                onClick={() => copyToClipboard(text)}
                className="flex items-center space-x-1 px-2 py-1 bg-[#1B2431] hover:bg-[#334155] rounded-md transition-colors duration-200 border border-[#475569]"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-[#1B2431] rounded-lg p-3 border border-[#475569] relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
              <p className="text-white text-sm break-all leading-relaxed font-mono pr-4">{text}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Length: {text.length} characters</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Hover to view</span>
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
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
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">NO Service:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.service_no)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Description:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.description)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Address:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.address)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Customer Name:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.customer_name)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Work Zone:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.workzone)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Tanggal PS:</span>
                <span className="text-white font-semibold">{formatDate(orderData.tanggal_ps)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Status Date:</span>
                <span className="text-white font-semibold">{formatDate(orderData.status_date)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">Contact Phone:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.contact_phone)}</span>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium mb-1">ODP:</span>
                <span className="text-white font-semibold">{getDisplayValue(orderData.odp)}</span>
              </div>
            </div>
          </div>
        )

      case "aktivasi":
        return (
          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold mb-4">Mitra</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">SYMPTOM:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.symptom)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Labor Teknisi:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.labor_teknisi)}</span>
                </div>
              </div>
            </div>
          </div>
        )



      case "update-lapangan":
        return (
          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold mb-4">Update Lapangan</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">TINJUT HD OPLANG:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.tinjut_hd_oplang)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Keterangan HD OPLANG:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.keterangan_hd_oplang)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">SUBERRORCODE:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.suberrorcode)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">UIC:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.uic)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Update UIC:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.update_uic)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Keterangan UIC:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.keterangan_uic)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Update Lapangan:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.update_lapangan)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">SYMPTOM:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.symptom)}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Engineering MEMO:</span>
                  <span className="text-white font-semibold">{getDisplayValue(orderData.engineering_memo)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "manja":
        return (
          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold mb-4">Manajemen Janji</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Umur MANJA:</span>
                  <span className="text-white font-semibold">Umur &gt; 3 hari</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Kategori MANJA:</span>
                  <span className="text-white font-semibold">Lewat MANJA</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">Booking date:</span>
                  <span className="text-white font-semibold">{formatDate(orderData.booking_date)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1e293b] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#475569]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#475569] bg-[#1B2431]">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              {orderData?.order_id || "No Order ID"}
            </h2>
            <Badge className={`${getStatusBimaColor(orderData?.status_bima)} text-white px-3 py-1 text-sm font-medium`}>
              {orderData?.status_bima || "UNKNOWN"}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-[#334155] hover:bg-[#475569] text-white border border-[#475569]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-[#334155]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel */}
          <div className="w-80 bg-[#334155] p-6 border-r border-[#475569]">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-white font-semibold text-lg">{orderData?.channel || "CHANNEL"}</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <span className="text-gray-300 text-sm font-medium">Order Created:</span>
                  <p className="text-white font-semibold mt-1">{formatDate(orderData?.date_created)}</p>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <span className="text-gray-300 text-sm font-medium">Work Order:</span>
                  <p className="text-white font-semibold mt-1">{getDisplayValue(orderData?.workorder)}</p>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <span className="text-gray-300 text-sm font-medium">SC Order No:</span>
                  <div className="text-white font-semibold mt-1">
                    <TruncatedText 
                      text={getDisplayValue(orderData?.sc_order_no)} 
                      maxLength={25}
                      className="text-white font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#475569] bg-[#1B2431]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-white bg-blue-600 border-b-2 border-blue-600"
                      : "text-gray-400 hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#1e293b]">
              {renderDetailContent()}
            </div>
          </div>
                </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

