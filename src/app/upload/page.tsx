"use client"

export const dynamic = 'force-dynamic'

import { FileUploadArea } from "@/components/upload/file-upload-area"
import { DataPreview } from "@/components/upload/data-preview"
import { useUpload } from "@/hooks/use-upload"

export default function UploadPage() {
  const { showPreview, csvData } = useUpload()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Upload Data</h1>
        <p className="text-gray-400">
          Upload your CSV file to get started with data analysis
        </p>
      </div>

      {/* File Upload Area */}
      <FileUploadArea />
      
      {/* Data Preview */}
      {showPreview && csvData && (
        <DataPreview csvData={csvData} />
      )}
    </div>
  )
}