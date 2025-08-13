import { useUpload } from "@/hooks/use-upload"
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function FileUploadArea() {
  const {
    csvData,
    fileName,
    isParsing,
    parsingProgress,
    showPreview,
    isUploading,
    uploadStatus,
    errorMessage,
    storageWarning,
    performanceMetrics,
    setShowPreview,
    handleFileUpload,
    handleDragOver,
    handleDrop,
    handleFileInput,
    handleSubmit,
    clearFile,
    cancelProcessing
  } = useUpload()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatProgress = (progress: typeof parsingProgress): string => {
    if (progress.totalBytes === 0) return '0%'
    const percentage = (progress.bytesProcessed / progress.totalBytes) * 100
    return `${percentage.toFixed(1)}%`
  }

  const formatProcessingSpeed = (speed: number): string => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)}k rows/sec`
    }
    return `${speed.toFixed(0)} rows/sec`
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area - Simple Design */}
      {!csvData && (
        <div
          className={`border-2 border-dashed border-gray-400 rounded-lg p-12 text-center transition-colors ${
            isParsing
              ? 'border-blue-500 bg-gray-800'
              : 'border-gray-400 hover:border-gray-300 bg-gray-900'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isParsing ? (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Processing {fileName}
                </h3>
                <p className="text-sm text-gray-400">
                  Please wait while we parse your CSV file...
                </p>
              </div>
              
              {/* Progress Display */}
              <div className="max-w-md mx-auto space-y-3">
                {/* File Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">File Progress</span>
                    <span className="text-white font-medium">
                      {formatProgress(parsingProgress)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${parsingProgress.totalBytes > 0 ? (parsingProgress.bytesProcessed / parsingProgress.totalBytes) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatFileSize(parsingProgress.bytesProcessed)} / {formatFileSize(parsingProgress.totalBytes)}
                  </div>
                </div>

                {/* Rows Progress */}
                {parsingProgress.totalChunks > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rows Processed</span>
                      <span className="text-white font-medium">
                        {parsingProgress.rowsProcessed.toLocaleString()} rows
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${parsingProgress.totalChunks > 0 ? (parsingProgress.currentChunk / parsingProgress.totalChunks) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Chunk {parsingProgress.currentChunk} of {parsingProgress.totalChunks}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {performanceMetrics.parsingSpeed > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="text-center p-2 bg-gray-800 rounded">
                      <div className="font-medium text-white">
                        {formatProcessingSpeed(performanceMetrics.parsingSpeed)}
                      </div>
                      <div className="text-gray-400">Speed</div>
                    </div>
                    <div className="text-center p-2 bg-gray-800 rounded">
                      <div className="font-medium text-white">
                        {formatTime(parsingProgress.processingTime)}
                      </div>
                      <div className="text-gray-400">Time</div>
                    </div>
                  </div>
                )}

                {/* Cancel Button */}
                <button
                  onClick={cancelProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel Processing</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Drag and drop to upload data (CSV) or import file from your computer
                </h3>
              </div>
              
              <div className="flex justify-center">
                <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Upload className="h-5 w-5 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-400">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Storage Warning */}
      {storageWarning && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-yellow-400">{storageWarning}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === "success" && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400">
              CSV file uploaded successfully!
            </span>
          </div>
        </div>
      )}

      {/* File Info & Actions */}
      {csvData && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {fileName}
                </h3>
                <p className="text-sm text-gray-400">
                  {csvData.headers.length} columns • {csvData.rows.length.toLocaleString()} rows
                </p>
                {performanceMetrics.parsingSpeed > 0 && (
                  <p className="text-xs text-blue-400">
                    Processed at {formatProcessingSpeed(performanceMetrics.parsingSpeed)}
                  </p>
                )}
                {performanceMetrics.chunkSize > 0 && (
                  <p className="text-xs text-green-400">
                    Chunk size: {performanceMetrics.chunkSize.toLocaleString()} rows
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
