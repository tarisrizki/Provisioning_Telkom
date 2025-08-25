"use client"

import { useState } from "react"
import { X, Download, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: any
}

export function DetailModal({ isOpen, onClose, orderData }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState("detail-customer")

  if (!isOpen) return null

  const tabs = [
    { id: "detail-customer", label: "Detail Customer" },
    { id: "service-area", label: "Service Area" },
    { id: "mitra", label: "Mitra" },
    { id: "update-lapangan", label: "Update lapangan" }
  ]

  // Generate dynamic data based on orderData
  const generateDynamicData = () => {
    const baseId = orderData?.orderId || "AO-00250626041731268866500"
    const timestamp = new Date().toLocaleString('id-ID')
    
    return {
      detailCustomer: {
        noService: `FG${Math.floor(Math.random() * 99999999)}`,
        description: `V${Math.floor(Math.random() * 999999)}_SMOOK`,
        address: `JL ${['Sastro Aceh', 'Merdeka', 'Sudirman', 'Thamrin', 'Gatot Subroto'][Math.floor(Math.random() * 5)]}`,
        customerName: ['SAIFUL JAMI', 'BUDI SANTOSO', 'SARI DEWI', 'AHMAD HIDAYAT', 'NURUL AINI'][Math.floor(Math.random() * 5)],
        workZone: Math.floor(Math.random() * 200) + 1,
        routingDate: timestamp,
        statusData: timestamp,
        contractId: Math.floor(Math.random() * 999999999999),
        dop: `DOP-${Math.floor(Math.random() * 999)}-FEK${Math.floor(Math.random() * 999)}`
      },
      serviceArea: {
        serviceArea: ['LAMUGA', 'LAPVISA', 'MELLABOCU', 'SERVICELATER', 'MAIL'][Math.floor(Math.random() * 5)],
        branch: ['BALAI', 'AC241', '29/12/21', '09/12/21'][Math.floor(Math.random() * 4)],
        area: ['LUNDEA', 'BARRETA', 'PINK WESTERN', 'BAHANA ACEH', 'MELLABORU'][Math.floor(Math.random() * 5)],
        symptom: ['AHM', 'RMA', 'ODP FAIL', 'COMPLETE', 'ASSIGNED'][Math.floor(Math.random() * 5)],
        subTipeMitra: `${['FAUZAN', 'BINAI', 'ISAL', 'BUDIAH'][Math.floor(Math.random() * 4)]}/${Math.floor(Math.random() * 999999999)}`,
        keterangan: `>${Math.floor(Math.random() * 20) + 1} HARI`,
        statusLapangan: ['CLOSED', 'OPEN', 'IN PROGRESS', 'PENDING'][Math.floor(Math.random() * 4)],
        symptom2: ['COMPUTED', 'ANOMALI', 'FO TES', 'OUTLET RTC'][Math.floor(Math.random() * 4)],
        engineeringMMG: `${['Budiah Nadh', 'Ahmad', 'Sari', 'Budi'][Math.floor(Math.random() * 4)]} CONFIG`
      },
      mitra: {
        mitraName: ['FAUZAN', 'BINAI', 'ISAL', 'BUDIAH', 'AHMAD'][Math.floor(Math.random() * 5)],
        mitraId: Math.floor(Math.random() * 999999999),
        type: ['Technical', 'Support', 'Engineering', 'Field'][Math.floor(Math.random() * 4)],
        status: ['Active', 'Inactive', 'Suspended', 'Pending'][Math.floor(Math.random() * 4)],
        areaCoverage: ['LAMUGA', 'LAPVISA', 'MELLABOCU', 'SERVICELATER'][Math.floor(Math.random() * 4)],
        performance: `${Math.floor(Math.random() * 40) + 60}%`
      },
      updateLapangan: {
        hasilHD: `FU ${Math.floor(Math.random() * 1000)}`,
        keteranganHD: (Math.random() * 10).toFixed(8),
        subTipeMitra: `${['odpimbe-try', 'mitra-tech', 'field-support'][Math.floor(Math.random() * 3)]}/${Math.floor(Math.random() * 99)}`,
        pic: ['ISAL', 'BUDI', 'SARI', 'AHMAD', 'NURUL'][Math.floor(Math.random() * 5)],
        statusUC: ['Done Cancel', 'In Progress', 'Completed', 'Failed'][Math.floor(Math.random() * 4)],
        keteranganUC: ['-', 'Pending Review', 'Under Investigation'][Math.floor(Math.random() * 3)],
        statusBlok: ['NONE FAIL', 'BLOCKED', 'CLEAR', 'PENDING'][Math.floor(Math.random() * 4)],
        statusDC: ['CANCELED', 'ACTIVE', 'SUSPENDED', 'PENDING'][Math.floor(Math.random() * 4)],
        statusWPRO: ['-', 'IN PROGRESS', 'COMPLETED', 'FAILED'][Math.floor(Math.random() * 4)],
        statusMALUA: ['-', 'ACTIVE', 'INACTIVE', 'PENDING'][Math.floor(Math.random() * 4)],
        umur: `> ${Math.floor(Math.random() * 10) + 1} hari`,
        keteranganMALUA: ['Lewat MALUA', 'Dalam MALUA', 'Pending MALUA'][Math.floor(Math.random() * 3)],
        statusMMG: ['-', 'ACTIVE', 'INACTIVE', 'PENDING'][Math.floor(Math.random() * 4)],
        tanggalPS: timestamp
      }
    }
  }

  const dynamicData = generateDynamicData()

  const renderDetailContent = () => {
    switch (activeTab) {
      case "detail-customer":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">NO Service:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.noService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Description:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Address:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Customer Name:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.customerName}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Work Zone:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.workZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Routing Date:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.routingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Status Data:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.statusData}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Contract ID:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.contractId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">DOP:</span>
                <span className="text-white font-medium">{dynamicData.detailCustomer.dop}</span>
              </div>
            </div>
          </div>
        )

      case "service-area":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Service Area:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.serviceArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Branch:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Area:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Symptom:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.symptom}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Sub/Tipe Mitra:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.subTipeMitra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Keterangan:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.keterangan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status Lapangan:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.statusLapangan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Symptom:</span>
                  <span className="text-white font-medium">{dynamicData.serviceArea.symptom2}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 text-sm">Engineering MMG:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{dynamicData.serviceArea.engineeringMMG}</span>
                <ArrowRight className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>
        )

      case "mitra":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Mitra Name:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.mitraName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Mitra ID:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.mitraId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Type:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.type}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Area Coverage:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.areaCoverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Performance:</span>
                  <span className="text-white font-medium">{dynamicData.mitra.performance}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "update-lapangan":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Hasil HD (DP/MG):</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.hasilHD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Keterangan HD (DP/MG):</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.keteranganHD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Sub/Tipe Mitra:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.subTipeMitra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">PIC:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.pic}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status UC:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.statusUC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Keterangan UC:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.keteranganUC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status Blok:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.statusBlok}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status D&C:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.statusDC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Status WPRO:</span>
                  <span className="text-white font-medium">{dynamicData.updateLapangan.statusWPRO}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-white font-medium mb-3">Manajemen Janji</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Status MALUA:</span>
                    <span className="text-white font-medium">{dynamicData.updateLapangan.statusMALUA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Umur:</span>
                    <span className="text-white font-medium">{dynamicData.updateLapangan.umur}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Keterangan MALUA:</span>
                    <span className="text-white font-medium">{dynamicData.updateLapangan.keteranganMALUA}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Status MMG:</span>
                    <span className="text-white font-medium">{dynamicData.updateLapangan.statusMMG}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Tanggal PS:</span>
                    <span className="text-white font-medium">{dynamicData.updateLapangan.tanggalPS}</span>
                  </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              {orderData?.orderId || "AO-00250626041731268866500"}
            </h2>
            <Badge className="bg-green-600 text-white">COMPLETE</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel */}
          <div className="w-80 bg-[#334155] p-6 border-r border-gray-600">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-white font-semibold text-lg">DIGIPOS</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-300 text-sm">Order Created:</span>
                  <p className="text-white font-medium">{new Date().toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-gray-300 text-sm">Work Order:</span>
                  <p className="text-white font-medium">WO-{Math.floor(Math.random() * 999999999)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-600">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-[#334155]"
                      : "text-gray-400 hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderDetailContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
