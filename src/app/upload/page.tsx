"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download } from "lucide-react"
import { DetailModal } from "@/components/upload/detail-modal"

interface WorkOrderData {
  orderId: string
  channel: string
  dateCreated: string
  workOrder: string
  soOrderNo: string
}

interface ServiceOrderData {
  orderId: string
  serviceArea: string
  branch: string
  cluster: string
  soOrderNo: string
}

interface MitraData {
  orderId: string
  mitra: string
  laborTeknis: string
}

interface UpdateLapaorganData {
  orderId: string
  updateLapaorgan: string
  symptom: string
  hasilQeqrisis: string
  statusRma: string
}

interface ManjaData {
  orderId: string
  kategoriManja: string
  umurManja: string
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
  const [selectedOrderData, setSelectedOrderData] = useState<any>(null)

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
    setManjaAnalysisData(prev => ({
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
            className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(workItem)}
          >
            <td className="p-4 text-gray-300">{workItem.orderId || ""}</td>
            <td className="p-4 text-gray-300">{workItem.channel || ""}</td>
            <td className="p-4 text-gray-300">{workItem.dateCreated || ""}</td>
            <td className="p-4 text-gray-300">{workItem.workOrder || ""}</td>
            <td className="p-4 text-gray-300">{workItem.soOrderNo || ""}</td>
          </tr>
        )
      case "Service order":
        const serviceItem = item as ServiceOrderData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(serviceItem)}
          >
            <td className="p-4 text-gray-300">{serviceItem.orderId}</td>
            <td className="p-4 text-gray-300">{serviceItem.serviceArea}</td>
            <td className="p-4 text-gray-300">{serviceItem.branch}</td>
            <td className="p-4 text-gray-300">{serviceItem.cluster}</td>
            <td className="p-4 text-gray-300">{serviceItem.soOrderNo}</td>
          </tr>
        )
      case "Mitra":
        const mitraItem = item as MitraData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(mitraItem)}
          >
            <td className="p-4 text-gray-300">{mitraItem.orderId}</td>
            <td className="p-4 text-gray-300">{mitraItem.mitra}</td>
            <td className="p-4 text-gray-300">{mitraItem.laborTeknis}</td>
          </tr>
        )
      case "Update lapaorgan":
        const updateItem = item as UpdateLapaorganData
        const getStatusColor = (status: string) => {
          switch (status) {
            case "COMPLETE":
              return "bg-green-600 text-white"
            case "WORK FAIL":
              return "bg-red-600 text-white"
            case "CANCEL WORK":
              return "bg-yellow-600 text-black"
            default:
              return "bg-gray-600 text-white"
          }
        }
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(updateItem)}
          >
            <td className="p-4 text-gray-300">{updateItem.orderId}</td>
            <td className="p-4 text-gray-300">{updateItem.updateLapaorgan}</td>
            <td className="p-4 text-gray-300">{updateItem.symptom}</td>
            <td className="p-4 text-gray-300">{updateItem.hasilQeqrisis}</td>
            <td className="p-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(updateItem.statusRma)}`}>
                {updateItem.statusRma}
              </span>
            </td>
          </tr>
        )
      case "MANJA":
        const manjaItem = item as ManjaData
        return (
          <tr 
            key={index} 
            className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors"
            onClick={() => openDetailModal(manjaItem)}
          >
            <td className="p-4 text-gray-300">{manjaItem.orderId}</td>
            <td className="p-4 text-gray-300">{manjaItem.kategoriManja}</td>
            <td className="p-4 text-gray-300">{manjaItem.umurManja}</td>
          </tr>
        )
      default:
        return null
    }
  }

  const currentData = getCurrentTabData()
  const headers = getCurrentTableHeaders()

  return (
    <div className="space-y-6">
      {/* Tabs Section */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "outline"}
              className={`${
                selectedTab === tab 
                  ? "bg-blue-600 text-white" 
                  : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filters.map((filter) => (
              <option key={filter} value={filter} className="bg-[#1e293b]">
                {filter}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Channel" className="bg-[#1e293b]">Channel</option>
            <option value="ORBIT" className="bg-[#1e293b]">ORBIT</option>
            <option value="DIGISHOP" className="bg-[#1e293b]">DIGISHOP</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedDateCreated}
            onChange={(e) => setSelectedDateCreated(e.target.value)}
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Date created" className="bg-[#1e293b]">Date created</option>
            <option value="This week" className="bg-[#1e293b]">This week</option>
            <option value="This month" className="bg-[#1e293b]">This month</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
          Reset Filter
        </Button>
      </div>

             {/* Data Table */}
       <Card className="bg-[#1e293b] border-[#334155]">
         <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="border-b border-[#334155]">
                 <tr>
                   {headers.map((header, index) => (
                     <th key={index} className="text-left p-4 text-gray-300 font-medium">
                       {header}
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {currentData.length > 0 ? (
                   currentData.map((item, index) => renderTableRow(item, index))
                 ) : (
                   <tr>
                     <td colSpan={headers.length} className="p-8 text-center text-gray-400">
                       No data available
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>

             {/* Analysis Section */}
       <Card className="bg-[#1e293b] border-[#334155]">
         <CardHeader>
           <CardTitle className="text-white">Analisis</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           {/* Total AO */}
           <div className="flex items-center justify-between">
             <span className="text-gray-300">Total AO</span>
             <span className="text-white font-semibold">10,089</span>
           </div>

                      {selectedTab === "Work Order" && (
             <div className="space-y-6">
               {/* Total AO */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-300 text-sm">Total AO</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
               </div>

               {/* Channel Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Channel</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '75%'}}>
                         <span className="text-white text-sm font-medium">75</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         ORBIT
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '25%'}}>
                         <span className="text-white text-sm font-medium">25</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         DIGISHOP
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Work Zone Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Work Zone</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '35%'}}>
                         <span className="text-white text-sm font-medium">35</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         JKT
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '32%'}}>
                         <span className="text-white text-sm font-medium">32</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MRO
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         LPS
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {selectedTab === "Service order" && (
             <div className="space-y-6">
               {/* Total AO */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-300 text-sm">Total AO</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
               </div>

               {/* Service Area Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Service Area</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '50%'}}>
                         <span className="text-white text-sm font-medium">50</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         SMM
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '50%'}}>
                         <span className="text-white text-sm font-medium">50</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         HSR
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Branch Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Branch</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '34%'}}>
                         <span className="text-white text-sm font-medium">34</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Cluster Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Cluster</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '25%'}}>
                         <span className="text-white text-sm font-medium">25</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '37%'}}>
                         <span className="text-white text-sm font-medium">37</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '38%'}}>
                         <span className="text-white text-sm font-medium">38</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BWI WESTERN PASAR
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {selectedTab === "Mitra" && (
             <div className="space-y-6">
               {/* Total AO */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-300 text-sm">Total AO</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
               </div>

               {/* Total Mitra Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Total Mitra</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         SDM
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         HSK
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '34%'}}>
                         <span className="text-white text-sm font-medium">34</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         HSK
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Top 5 Labor teknis Analysis */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Top 5 Labor teknis</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BINAI 087272911 FAUZAN
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '33%'}}>
                         <span className="text-white text-sm font-medium">33</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BINAI 087272911 FAUZAN
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '34%'}}>
                         <span className="text-white text-sm font-medium">34</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         BINAI 087272911 FAUZAN
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {selectedTab === "Update lapaorgan" && (
             <div className="space-y-6">
               {/* Total AO */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-300 text-sm">Total AO</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
               </div>

               {/* Status BIMA */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Status BIMA</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <div className="bg-green-600 px-3 py-1 rounded text-white text-xs font-medium">COMPLETE</div>
                     <span className="text-white font-semibold text-lg">80</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="bg-red-600 px-3 py-1 rounded text-white text-xs font-medium">WORK FAIL</div>
                     <span className="text-white font-semibold text-lg">57</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="bg-green-600 px-3 py-1 rounded text-white text-xs font-medium">COMPLETE</div>
                     <span className="text-white font-semibold text-lg">109</span>
                   </div>
                 </div>
               </div>

               {/* Update Lapangan */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Update Lapangan</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         ORBIT
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         DIGISHOP
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Symptom */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Symptom</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                         <span className="text-white text-sm font-medium">RO</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MRO
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '85%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         LPS
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Tindak Lanjut HD OPLANG */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Tindak Lanjut HD OPLANG</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         RO
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '55%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MRO
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: '85%'}}>
                         <span className="text-white text-sm font-medium">26</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         LPS
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {selectedTab === "MANJA" && (
             <div className="space-y-6">
               {/* Total AO */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-300 text-sm">Total AO</span>
                   <span className="text-white font-semibold text-lg">{manjaAnalysisData.totalAO.toLocaleString()}</span>
                 </div>
               </div>

               {/* Kategori MANJA */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Kategori MANJA</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.lewatManja/100)*100, 100)}%`}}>
                         <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.lewatManja}</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         Lewat MANJA
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlus/100)*100, 100)}%`}}>
                         <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlus}</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MANJA H+
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlusPlus/100)*100, 100)}%`}}>
                         <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlusPlus}</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MANJA H++
                       </div>
                     </div>
                   </div>

                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-200 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHI/100)*100, 100)}%`}}>
                         <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHI}</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         MANJA HI
                       </div>
                     </div>
                   </div>
                 </div>
      </div>

               {/* Umur MANJA */}
               <div className="bg-[#334155] rounded-lg p-4">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-gray-300 text-sm">Umur MANJA</span>
                   <span className="text-white font-semibold text-lg">10,089</span>
                 </div>
                 <div className="space-y-3">
                   <div className="relative">
                     <div className="w-full bg-gray-700 rounded-lg h-8 relative overflow-hidden">
                       <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3" style={{width: `${Math.min((manjaAnalysisData.umurManja.umurLebih3Hari/100)*100, 100)}%`}}>
                         <span className="text-white text-sm font-medium">{manjaAnalysisData.umurManja.umurLebih3Hari}</span>
                       </div>
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                         Umur &gt; 3 hari
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Update Button */}
               <div className="flex justify-center">
                 <button 
                   onClick={updateManjaData}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                 >
                   Update Data
                 </button>
               </div>
             </div>
           )}
                 </CardContent>
      </Card>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        orderData={selectedOrderData}
      />
    </div>
  )
}