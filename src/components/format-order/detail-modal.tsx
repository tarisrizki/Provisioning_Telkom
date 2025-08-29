"use client"

import { useState } from "react"
import { X, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    orderId?: string
    channel?: string
    dateCreated?: string
    workOrder?: string
    soOrderNo?: string
    serviceArea?: string
    branch?: string
    cluster?: string
    mitra?: string
    laborTeknis?: string
    updateLapaorgan?: string
    symptom?: string
    hasilQeqrisis?: string
    statusRma?: string
    kategoriManja?: string
    umurManja?: string
    [key: string]: unknown
  } | null
}

export function DetailModal({ isOpen, onClose, orderData }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState("detail-customer")

  if (!isOpen) return null

  const tabs = [
    { id: "detail-customer", label: "Detail Customer" },
    { id: "service-area", label: "Service Area" },
    { id: "mitra", label: "Mitra" },
    { id: "update-lapangan", label: "Update Lapangan" },
    { id: "manja", label: "MANJA" }
  ]

  // Generate dynamic data based on orderData
  const generateDynamicData = () => {
    const timestamp = new Date().toLocaleString('id-ID')
    
    return {
      detailCustomer: {
        noService: `FG${Math.floor(Math.random() * 99999999)}`,
        description: `V${Math.floor(Math.random() * 999999)}_SMOOGA`,
        address: `JL Sastro Aceh ${Math.floor(Math.random() * 9999)}`,
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
        area: ['LANGSA', 'BARRETA', 'PINK WESTERN', 'BAHANA ACEH', 'MELLABORU'][Math.floor(Math.random() * 5)],
        symptom: ['ATM', 'RMA', 'ODP FAIL', 'COMPLETE', 'ASSIGNED'][Math.floor(Math.random() * 5)],
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
        subTipeMitra: `${['odp-imbe-try', 'mitra-tech', 'field-support'][Math.floor(Math.random() * 3)]}/${Math.floor(Math.random() * 99)}`,
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
      },
      manja: {
        subTipeMitra: 'Umum - 3 hari',
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">No Service:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.noService}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Description:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.description}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Address:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.address}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Customer Name:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.customerName}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Work Zone:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.workZone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Routing Date:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.routingDate}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Status Data:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.statusData}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Contract ID:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.contractId}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">DOP:</span>
                  <span className="text-white font-semibold">{dynamicData.detailCustomer.dop}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "service-area":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Service Area:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.serviceArea}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Branch:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.branch}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Area:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.area}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Symptom:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.symptom}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Sub Tipe Mitra:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.subTipeMitra}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Keterangan:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.keterangan}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status Lapangan:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.statusLapangan}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Symptom 2:</span>
                    <span className="text-white font-semibold">{dynamicData.serviceArea.symptom2}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm font-medium">Engineering MMG:</span>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold">{dynamicData.serviceArea.engineeringMMG}</span>
                  <Button size="sm" className="h-8 w-8 p-0 bg-white text-gray-800 hover:bg-gray-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "mitra":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Mitra Name:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.mitraName}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Mitra ID:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.mitraId}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Type:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.type}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.status}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Area Coverage:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.areaCoverage}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Performance:</span>
                    <span className="text-white font-semibold">{dynamicData.mitra.performance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "update-lapangan":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Hasil HD:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.hasilHD}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Keterangan HD:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.keteranganHD}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Sub Tipe Mitra:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.subTipeMitra}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">PIC:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.pic}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status UC:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.statusUC}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Keterangan UC:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.keteranganUC}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status Blok:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.statusBlok}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status DC:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.statusDC}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status WPRO:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.statusWPRO}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Status MALUA:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.statusMALUA}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Umur:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.umur}</span>
                  </div>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Keterangan MALUA:</span>
                    <span className="text-white font-semibold">{dynamicData.updateLapangan.keteranganMALUA}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Status MMG:</span>
                  <span className="text-white font-semibold">{dynamicData.updateLapangan.statusMMG}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Tanggal PS:</span>
                  <span className="text-white font-semibold">{dynamicData.updateLapangan.tanggalPS}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "manja":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Sub Tipe Mitra:</span>
                  <span className="text-white font-semibold">{dynamicData.manja.subTipeMitra}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Keterangan MALUA:</span>
                  <span className="text-white font-semibold">{dynamicData.manja.keteranganMALUA}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Status MMG:</span>
                  <span className="text-white font-semibold">{dynamicData.manja.statusMMG}</span>
                </div>
              </div>
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Tanggal PS:</span>
                  <span className="text-white font-semibold">{dynamicData.manja.tanggalPS}</span>
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
      <div className="bg-[#1e293b] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#475569]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#475569] bg-[#1B2431]">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              {orderData?.orderId || "AD-60250828041731268865d0"}
            </h2>
            <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-medium">COMPLETE</Badge>
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
                <h3 className="text-white font-semibold text-lg">DIGIPOS</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <span className="text-gray-300 text-sm font-medium">Order Created:</span>
                  <p className="text-white font-semibold mt-1">{new Date().toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                  <span className="text-gray-300 text-sm font-medium">Work Order:</span>
                  <p className="text-white font-semibold mt-1">WO-{Math.floor(Math.random() * 999999999)}</p>
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
  )
}
