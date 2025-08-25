"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, Download, FileText, Users, Settings, Activity, BarChart3, RefreshCw } from "lucide-react"
import { DetailModal } from "@/components/upload/detail-modal"

interface WorkOrderData {
  orderId: string
  channel: string
  dateCreated: string
  workOrder: string
  soOrderNo: string
  [key: string]: unknown
}

interface ServiceOrderData {
  orderId: string
  serviceArea: string
  branch: string
  cluster: string
  soOrderNo: string
  [key: string]: unknown
}

interface MitraData {
  orderId: string
  mitra: string
  laborTeknis: string
  [key: string]: unknown
}

interface UpdateLapaorganData {
  orderId: string
  updateLapaorgan: string
  symptom: string
  hasilQeqrisis: string
  statusRma: string
  [key: string]: unknown
}

interface ManjaData {
  orderId: string
  kategoriManja: string
  umurManja: string
  [key: string]: unknown
}

type TableData = WorkOrderData | ServiceOrderData | MitraData | UpdateLapaorganData | ManjaData

export default function FormatOrderPage() {
  const [selectedTab, setSelectedTab] = useState("Work Order")
  const [selectedFilter, setSelectedFilter] = useState("Oktober")
  const [selectedChannel, setSelectedChannel] = useState("Channel")
  const [selectedDateCreated, setSelectedDateCreated] = useState("Date created")

  // Dynamic data for MANJA analysis
  const [manjaAnalysisData, setManjaAnalysisData] = useState({
    totalAO: 10089,
    kategoriManja: {
      lewatManja: 26,
      manjaHPlus: 45,
      manjaHPlusPlus: 78,
      manjaHI: 32
    },
    umurManja: {
      umurLebih3Hari: 67
    }
  })

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrderData, setSelectedOrderData] = useState<TableData | null>(null)

  const tabs = ["Work Order", "Service order", "Mitra", "Update lapaorgan", "MANJA"]
  const filters = ["Oktober", "November", "Desember", "Januari"]

  // Sample data for different tabs
  const workOrderData: WorkOrderData[] = [
    { orderId: "AO2007000471756866864988", channel: "DIGIPOS", dateCreated: "01/07/2025 12:45", workOrder: "WO-726382671", soOrderNo: "SO-001" },
    { orderId: "AO2007000471756866864936", channel: "DIGIPOS", dateCreated: "01/07/2025 13:20", workOrder: "WO-726382672", soOrderNo: "SO-002" },
    { orderId: "AO2007000471756866864994", channel: "DIGIPOS", dateCreated: "01/07/2025 14:15", workOrder: "WO-726382673", soOrderNo: "SO-003" },
    { orderId: "AO2007000471756866864507", channel: "DIGIPOS", dateCreated: "01/07/2025 15:30", workOrder: "WO-726382674", soOrderNo: "SO-004" },
    { orderId: "AO2007225471756866864507", channel: "DIGIPOS", dateCreated: "01/07/2025 16:45", workOrder: "WO-726382675", soOrderNo: "SO-005" },
    { orderId: "AO2007225471756866864540", channel: "DIGIPOS", dateCreated: "01/07/2025 17:20", workOrder: "WO-726382676", soOrderNo: "SO-006" },
    { orderId: "AO2007225471756866864541", channel: "DIGIPOS", dateCreated: "01/07/2025 18:10", workOrder: "WO-726382677", soOrderNo: "SO-007" }
  ]
  
  const serviceOrderData: ServiceOrderData[] = [
    { orderId: "AO2007000471756866864988", serviceArea: "LAPVISA", branch: "29/12/21", cluster: "LAPVISA", soOrderNo: "" },
    { orderId: "AO2007000471756866864936", serviceArea: "LAPVISA", branch: "AC241", cluster: "LAPVISA", soOrderNo: "" },
    { orderId: "AO2007000471756866864994", serviceArea: "MELLABOCU", branch: "AC241", cluster: "BARRETA", soOrderNo: "" },
    { orderId: "AO2007000471756866864507", serviceArea: "SERVICELATER", branch: "AC241", cluster: "PINK WESTERN", soOrderNo: "" },
    { orderId: "AO2007225471756866864507", serviceArea: "MAIL", branch: "AC241", cluster: "BAHANA ACEH", soOrderNo: "" },
    { orderId: "AO2007225471756866864540", serviceArea: "MELLABOCU", branch: "AC241", cluster: "MELLABORU", soOrderNo: "" },
    { orderId: "AO2007225471756866864540", serviceArea: "LAPVISA", branch: "09/12/21", cluster: "LAPVISA", soOrderNo: "" }
  ]

  const mitraData: MitraData[] = [
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" },
    { orderId: "AO2007506404713988866540", mitra: "ATM", laborTeknis: "BINAI 087272911 FAUZAN" }
  ]

  const updateLapaorganData: UpdateLapaorganData[] = [
    { orderId: "AO2007506404713988866540", updateLapaorgan: "Kendala pelanggan", symptom: "RMA", hasilQeqrisis: "ANOMALI", statusRma: "COMPLETE" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "Kendala pelanggan", symptom: "RMA", hasilQeqrisis: "ANOMALI", statusRma: "WORK FAIL" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "ASSIGNED", symptom: "ASSIGNED", hasilQeqrisis: "FO TES", statusRma: "WORK FAIL" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "Kendala Teknis (VOICE)", symptom: "ODP FAIL", hasilQeqrisis: "OUTLET RTC", statusRma: "WORK FAIL" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "Serah tanggung", symptom: "RMA", hasilQeqrisis: "FO TES", statusRma: "COMPLETE" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "CLOSED", symptom: "COMPLETE", hasilQeqrisis: "COMPLETE", statusRma: "CANCEL WORK" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "CANCEL", symptom: "CANCEL", hasilQeqrisis: "CANCEL", statusRma: "CANCEL WORK" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "CANCEL", symptom: "CANCEL", hasilQeqrisis: "CANCEL", statusRma: "CANCEL WORK" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "CANCEL", symptom: "CANCEL", hasilQeqrisis: "CANCEL", statusRma: "CANCEL WORK" },
    { orderId: "AO2007506404713988866540", updateLapaorgan: "CANCEL", symptom: "CANCEL", hasilQeqrisis: "CANCEL", statusRma: "CANCEL WORK" }
  ]

  const manjaData: ManjaData[] = [
    { orderId: "AO2007506404713988866540", kategoriManja: "Lewat MANJA", umurManja: "Umur > 3 hari" },
    { orderId: "AO2007506404713988866541", kategoriManja: "Manja H+", umurManja: "Umur 1-2 hari" },
    { orderId: "AO2007506404713988866542", kategoriManja: "Manja H++", umurManja: "Umur 2-3 hari" },
    { orderId: "AO2007506404713988866543", kategoriManja: "Manja HI", umurManja: "Umur > 5 hari" },
    { orderId: "AO2007506404713988866544", kategoriManja: "Lewat MANJA", umurManja: "Umur > 3 hari" },
    { orderId: "AO2007506404713988866545", kategoriManja: "Manja H+", umurManja: "Umur 1-2 hari" },
    { orderId: "AO2007506404713988866546", kategoriManja: "Manja H++", umurManja: "Umur 2-3 hari" }
  ]

  const getCurrentTabData = (): TableData[] => {
    switch (selectedTab) {
      case "Work Order":
        return workOrderData
      case "Service order":
        return serviceOrderData
      case "Mitra":
        return mitraData
      case "Update lapaorgan":
        return updateLapaorganData
      case "MANJA":
        return manjaData
      default:
        return []
    }
  }

  const getCurrentTableHeaders = () => {
    switch (selectedTab) {
      case "Work Order":
        return ["Order ID", "Channel", "Date Created", "Work Order", "SO Order NO"]
      case "Service order":
        return ["Order ID", "Service Area", "Branch", "Cluster", "SO Order NO"]
      case "Mitra":
        return ["Order ID", "Mitra", "Labor teknis"]
      case "Update lapaorgan":
        return ["Order ID", "Update lapaorgan", "Symptom", "Hasil QEQRISIS", "Status RMA"]
      case "MANJA":
        return ["Order ID", "Kategori MANJA", "Umur MANJA"]
      default:
        return ["Order ID", "Channel", "Date Created", "Work Order", "SO Order NO"]
    }
  }

  // Function to update MANJA analysis data dynamically
  const updateManjaData = () => {
    setManjaAnalysisData(() => ({
      totalAO: Math.floor(Math.random() * 20000) + 5000,
      kategoriManja: {
        lewatManja: Math.floor(Math.random() * 100) + 10,
        manjaHPlus: Math.floor(Math.random() * 100) + 10,
        manjaHPlusPlus: Math.floor(Math.random() * 100) + 10,
        manjaHI: Math.floor(Math.random() * 100) + 10
      },
      umurManja: {
        umurLebih3Hari: Math.floor(Math.random() * 100) + 10
      }
    }))
  }

  // Function to open detail modal
  const openDetailModal = (orderData: TableData) => {
    setSelectedOrderData(orderData)
    setIsDetailModalOpen(true)
  }

  // Function to close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOrderData(null)
  }

  const renderTableRow = (item: TableData, index: number) => {
    switch (selectedTab) {
      case "Work Order":
        const workItem = item as WorkOrderData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(item)}
          >
            <td className="px-6 py-4 text-sm text-gray-300">{workItem.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{workItem.channel}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{workItem.dateCreated}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{workItem.workOrder}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{workItem.soOrderNo}</td>
          </tr>
        )
      case "Service order":
        const serviceItem = item as ServiceOrderData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(item)}
          >
            <td className="px-6 py-4 text-sm text-gray-300">{serviceItem.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{serviceItem.serviceArea}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{serviceItem.branch}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{serviceItem.cluster}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{serviceItem.soOrderNo}</td>
          </tr>
        )
      case "Mitra":
        const mitraItem = item as MitraData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(item)}
          >
            <td className="px-6 py-4 text-sm text-gray-300">{mitraItem.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{mitraItem.mitra}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{mitraItem.laborTeknis}</td>
          </tr>
        )
      case "Update lapaorgan":
        const updateItem = item as UpdateLapaorganData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(item)}
          >
            <td className="px-6 py-4 text-sm text-gray-300">{updateItem.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{updateItem.updateLapaorgan}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{updateItem.symptom}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{updateItem.hasilQeqrisis}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{updateItem.statusRma}</td>
          </tr>
        )
      case "MANJA":
        const manjaItem = item as ManjaData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(item)}
          >
            <td className="px-6 py-4 text-sm text-gray-300">{manjaItem.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{manjaItem.kategoriManja}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{manjaItem.umurManja}</td>
          </tr>
        )
      default:
        return null
    }
  }

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "Work Order":
        return <FileText className="h-4 w-4" />
      case "Service order":
        return <Settings className="h-4 w-4" />
      case "Mitra":
        return <Users className="h-4 w-4" />
      case "Update lapaorgan":
        return <Activity className="h-4 w-4" />
      case "MANJA":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Format Order Management</h1>
          <p className="text-gray-400 text-lg">
            Manage and analyze your provisioning orders across different categories.
        </p>
      </div>

        {/* Tabs Navigation */}
        <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-[#0f172a] text-gray-300 hover:bg-[#334155] hover:text-white"
                  }`}
                >
                  {getTabIcon(tab)}
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[140px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {filters.map((filter) => (
                      <SelectItem key={filter} value={filter} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {filter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-[140px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    <SelectItem value="Channel" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Channel</SelectItem>
                    <SelectItem value="DIGIPOS" className="text-white hover:bg-[#334155] focus:bg-[#334155]">DIGIPOS</SelectItem>
                    <SelectItem value="ATM" className="text-white hover:bg-[#334155] focus:bg-[#334155]">ATM</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDateCreated} onValueChange={setSelectedDateCreated}>
                  <SelectTrigger className="w-[160px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    <SelectItem value="Date created" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Date created</SelectItem>
                    <SelectItem value="Today" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Today</SelectItem>
                    <SelectItem value="This Week" className="text-white hover:bg-[#334155] focus:bg-[#334155]">This Week</SelectItem>
                    <SelectItem value="This Month" className="text-white hover:bg-[#334155] focus:bg-[#334155]">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] hover:border-[#64748b] transition-all duration-200 shadow-md"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>

              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-xl font-semibold">{selectedTab} Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#475569]">
                    {getCurrentTableHeaders().map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {getCurrentTabData().map((item, index) => renderTableRow(item, index))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section */}
        {selectedTab === "Work Order" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
              </div>

              {/* Channel Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Channel</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '75%'}}>
                        <span className="text-white text-sm font-medium">75</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        ORBIT
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '25%'}}>
                        <span className="text-white text-sm font-medium">25</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        DIGISHOP
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Zone Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Work Zone</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '35%'}}>
                        <span className="text-white text-sm font-medium">35</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        JKT
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '32%'}}>
                        <span className="text-white text-sm font-medium">32</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MRO
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        LPS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "Service order" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Settings className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
              </div>

              {/* Service Area Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Service Area</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '50%'}}>
                        <span className="text-white text-sm font-medium">50</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        SMM
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '50%'}}>
                        <span className="text-white text-sm font-medium">50</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        HSR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Branch</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '34%'}}>
                        <span className="text-white text-sm font-medium">34</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cluster Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Cluster</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '25%'}}>
                        <span className="text-white text-sm font-medium">25</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '37%'}}>
                        <span className="text-white text-sm font-medium">37</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '38%'}}>
                        <span className="text-white text-sm font-medium">38</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BWI WESTERN PASAR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "Mitra" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
              </div>

              {/* Total Mitra Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Total Mitra</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        SDM
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        HSK
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '34%'}}>
                        <span className="text-white text-sm font-medium">34</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        HSK
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 5 Labor teknis Analysis */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Top 5 Labor teknis</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BINAI 087272911 FAUZAN
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '33%'}}>
                        <span className="text-white text-sm font-medium">33</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BINAI 087272911 FAUZAN
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '34%'}}>
                        <span className="text-white text-sm font-medium">34</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        BINAI 087272911 FAUZAN
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "Update lapaorgan" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Activity className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
              </div>

              {/* Status BIMA */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Status BIMA</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-green-600 px-3 py-1 rounded text-white text-xs font-medium shadow-md">COMPLETE</div>
                    <span className="text-white font-semibold text-lg">80</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-red-600 px-3 py-1 rounded text-white text-xs font-medium shadow-md">WORK FAIL</div>
                    <span className="text-white font-semibold text-lg">57</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-green-600 px-3 py-1 rounded text-white text-xs font-medium shadow-md">COMPLETE</div>
                    <span className="text-white font-semibold text-lg">109</span>
                  </div>
                </div>
              </div>

              {/* Update Lapangan */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Update Lapangan</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        ORBIT
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        DIGISHOP
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptom */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Symptom</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-white text-sm font-medium">RO</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MRO
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '85%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        LPS
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tindak Lanjut HD OPLANG */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Tindak Lanjut HD OPLANG</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        RO
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '55%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MRO
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '85%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        LPS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "MANJA" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">{manjaAnalysisData.totalAO.toLocaleString()}</span>
                </div>
              </div>

              {/* Kategori MANJA */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Kategori MANJA</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.lewatManja/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.lewatManja}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        Lewat MANJA
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlus/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlus}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA H+
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlusPlus/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlusPlus}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA H++
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-200 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHI/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHI}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA HI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Umur MANJA */}
              <div className="bg-[#0f172a] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Umur MANJA</span>
                  <span className="text-white font-semibold text-lg">10,089</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.umurManja.umurLebih3Hari/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.umurManja.umurLebih3Hari}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        Umur &gt; 3 hari
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={updateManjaData}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detail Modal */}
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          orderData={selectedOrderData}
        />
      </div>
    </div>
  )
}