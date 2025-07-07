import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle, Brain, Scan } from 'lucide-react'
import { motion } from 'framer-motion'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
  uploadProgress?: number
  error?: string
  acceptedFiles?: string[]
  maxSize?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  error,
  acceptedFiles = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxSize = 10485760 // 10MB
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize,
    multiple: false,
    disabled: isUploading
  })

  const getBorderColor = () => {
    if (error || isDragReject) return 'border-red-400/50'
    if (isDragActive) return 'border-cyan-400/50'
    if (isUploading) return 'border-green-400/50'
    return 'border-cyan-500/30'
  }

  const getBackgroundColor = () => {
    if (error || isDragReject) return 'bg-red-500/5'
    if (isDragActive) return 'bg-cyan-500/10'
    if (isUploading) return 'bg-green-500/5'
    return 'bg-slate-700/30'
  }

  const getIcon = () => {
    if (error) return <AlertCircle className="h-16 w-16 text-red-400" />
    if (isUploading) return <CheckCircle className="h-16 w-16 text-green-400" />
    if (isDragActive) return <Scan className="h-16 w-16 text-cyan-400" />
    return <Upload className="h-16 w-16 text-slate-400" />
  }

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer backdrop-blur-sm
          ${getBorderColor()} ${getBackgroundColor()}
          ${isUploading ? 'cursor-not-allowed' : 'hover:border-cyan-400/70 hover:bg-cyan-500/5'}
        `}
        whileHover={!isUploading ? { scale: 1.02 } : {}}
        whileTap={!isUploading ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
          
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">
              {isUploading ? 'Uploading...' : isDragActive ? 'Drop your file here' : 'Upload Medical Report'}
            </h3>
            <p className="text-slate-300 text-lg">
              {isUploading ? `${uploadProgress}% complete` : isDragActive ? 'Release to upload' : 'Drag & drop or click to browse'}
            </p>
            
            {!isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-slate-400">
                  <FileText className="h-5 w-5" />
                  <span>Supported: PDF, JPG, PNG (Max 10MB)</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Scan className="h-4 w-4" />
                    <span>OCR Ready</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Floating particles effect */}
        {isDragActive && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: 0 
                }}
                animate={{ 
                  y: '-100%',
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center space-x-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  )
}

export default FileUpload