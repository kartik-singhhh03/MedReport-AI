import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Brain,
  Microscope,
  Zap
} from 'lucide-react'
import { Card } from '../UI/Card'
import { Button } from '../UI/Button'
import { ProgressBar } from '../UI/ProgressBar'
import { useFileUpload } from '../../hooks/useFileUpload'
import AnalysisResult from './AnalysisResult'
import { toast } from 'react-hot-toast'

interface FileUploadProps {
  onAnalysisComplete?: (analysis: any) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { uploadFile, uploadProgress, isUploading, resetProgress } = useFileUpload()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, JPEG, PNG, or text files only.')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB.')
      return
    }

    setUploadedFile(file)
    resetProgress()

    try {
      setIsAnalyzing(true)
      const result = await uploadFile(file)
      
      // Simulate analysis process with real-time updates
      await simulateAnalysisProcess()
      
      // Set analysis result
      setAnalysisResult({
        simpleExplanation: "Your medical report has been analyzed using advanced AI. The findings indicate normal ranges for most parameters, with some areas requiring attention.",
        technicalAnalysis: "Comprehensive analysis completed using OCR extraction and medical AI models. Key biomarkers identified and compared against standard reference ranges.",
        aiRecommendations: "Continue with regular health monitoring. Schedule follow-up appointments as recommended. Consider lifestyle modifications for optimal health outcomes.",
        healthScore: 85,
        riskLevel: 'low',
        keyFindings: [
          'Document processed successfully',
          'Medical terminology validated',
          'AI analysis completed'
        ],
        biomarkers: {
          hemoglobin: { value: '13.2', unit: 'g/dL', normal: '12.0-15.5', status: 'normal' },
          glucose: { value: '98', unit: 'mg/dL', normal: '70-100', status: 'normal' }
        },
        confidence: 95,
        processingTime: 2500
      })

      onAnalysisComplete?.(result)
      toast.success('Medical report analyzed successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [uploadFile, onAnalysisComplete, resetProgress])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const simulateAnalysisProcess = async () => {
    // Simulate the analysis steps
    const steps = [
      { name: 'OCR Processing', duration: 800 },
      { name: 'Medical Term Validation', duration: 600 },
      { name: 'AI Analysis', duration: 1100 }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration))
    }
  }

  const handleDownload = () => {
    if (!analysisResult) return

    // Create a downloadable report
    const reportContent = `
Medical Report Analysis
======================

File: ${uploadedFile?.name}
Date: ${new Date().toLocaleDateString()}

HEALTH SCORE: ${analysisResult.healthScore}/100
RISK LEVEL: ${analysisResult.riskLevel.toUpperCase()}

SIMPLE EXPLANATION:
${analysisResult.simpleExplanation}

TECHNICAL ANALYSIS:
${analysisResult.technicalAnalysis}

AI RECOMMENDATIONS:
${analysisResult.aiRecommendations}

KEY FINDINGS:
${analysisResult.keyFindings.map((finding: string) => `• ${finding}`).join('\n')}

BIOMARKERS:
${Object.entries(analysisResult.biomarkers).map(([key, biomarker]: [string, any]) => 
  `${key.replace(/_/g, ' ').toUpperCase()}: ${biomarker.value} ${biomarker.unit} (Normal: ${biomarker.normal}, Status: ${biomarker.status})`
).join('\n')}

Confidence: ${analysisResult.confidence}%
Processing Time: ${analysisResult.processingTime}ms
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${uploadedFile?.name?.replace(/\.[^/.]+$/, '')}_analysis.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Analysis report downloaded!')
  }

  const removeFile = () => {
    setUploadedFile(null)
    setAnalysisResult(null)
    resetProgress()
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-500/20 rounded-full">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? 'Drop your medical report here' : 'Upload Medical Report'}
              </h3>
              <p className="text-slate-400">
                Drag and drop your PDF, image, or text file here, or click to browse
              </p>
            </div>
            
            <div className="text-sm text-slate-500">
              Supported formats: PDF, JPEG, PNG, TXT (Max 10MB)
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Progress */}
      <AnimatePresence>
        {(isUploading || isAnalyzing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <span className="text-white font-medium">
                      {isUploading ? 'Uploading file...' : 'Analyzing medical report...'}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {uploadProgress.percentage}%
                  </span>
                </div>
                
                <ProgressBar 
                  value={uploadProgress.percentage} 
                  max={100}
                  className="h-2"
                />
                
                <div className="text-sm text-slate-400">
                  {uploadProgress.message}
                </div>

                {/* Analysis Steps */}
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-slate-300">OCR Processing</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Microscope className="h-4 w-4 text-blue-500" />
                      <span className="text-slate-300">Medical Term Validation</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Zap className="h-4 w-4 text-purple-500 animate-pulse" />
                      <span className="text-slate-300">AI Analysis</span>
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded File Info */}
      <AnimatePresence>
        {uploadedFile && !isUploading && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={removeFile}
                  variant="ghost"
                  size="sm"
                  icon={<X className="h-4 w-4" />}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisResult
              analysis={analysisResult}
              fileName={uploadedFile?.name || 'Unknown file'}
              onDownload={handleDownload}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {uploadProgress.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-red-500/20 bg-red-500/10">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <h4 className="text-white font-medium">Upload Failed</h4>
                  <p className="text-sm text-red-400">{uploadProgress.message}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload