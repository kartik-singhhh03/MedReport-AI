import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useReports } from '../../hooks/useReports'
import { useReportAnalysis } from '../../hooks/useReportAnalysis'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import toast from 'react-hot-toast'

export function FileUpload() {
  const { uploadFile, uploading, progress } = useFileUpload()
  const { createReport } = useReports()
  const { analyzeReport, analyzing } = useReportAnalysis()
  const { user } = useAuth()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return

    const file = acceptedFiles[0]
    if (!file) return

    try {
      // Step 1: Upload file to storage
      toast.loading('Uploading file...', { id: 'upload' })
      const uploadResult = await uploadFile(file)
      
      // Step 2: Create report record
      toast.loading('Creating report...', { id: 'upload' })
      const reportResult = await createReport.mutateAsync({
        user_id: user.id,
        filename: uploadResult.fileName,
        file_url: uploadResult.filePath, // Use filePath instead of fileUrl for storage reference
        file_type: uploadResult.fileType,
        status: 'processing',
      })

      toast.success('File uploaded successfully!', { id: 'upload' })

      // Step 3: Start AI analysis
      toast.loading('Analyzing report with AI...', { id: 'analysis' })
      
      try {
        await analyzeReport(reportResult.id)
        toast.success('Report analysis completed!', { id: 'analysis' })
      } catch (analysisError) {
        toast.error('Analysis failed, but file was uploaded successfully.', { id: 'analysis' })
        console.error('Analysis error:', analysisError)
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed', { id: 'upload' })
    }
  }, [uploadFile, createReport, analyzeReport, user])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: uploading || analyzing
  })

  const isProcessing = uploading || analyzing

  return (
    <Card className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Medical Report</h3>
        <p className="text-gray-600">Upload your medical report for AI-powered analysis</p>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </div>

          {isProcessing ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {uploading ? `Uploading... ${progress}%` : 'Analyzing with AI...'}
              </p>
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {analyzing && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your medical report here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-blue-600 font-medium">browse files</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports PDF, JPEG, PNG (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">
              {fileRejections[0].errors[0].message}
            </p>
          </div>
        </div>
      )}

      {/* AI Analysis Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">🤖 AI-Powered Analysis</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Technical medical analysis</li>
          <li>• Simple explanations in English & Hindi</li>
          <li>• Personalized health recommendations</li>
          <li>• Instant results powered by GPT-4</li>
        </ul>
      </div>
    </Card>
  )
}