import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
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
    if (error || isDragReject) return 'border-red-300 dark:border-red-600'
    if (isDragActive) return 'border-blue-400 dark:border-blue-500'
    if (isUploading) return 'border-green-300 dark:border-green-600'
    return 'border-gray-300 dark:border-gray-600'
  }

  const getBackgroundColor = () => {
    if (error || isDragReject) return 'bg-red-50 dark:bg-red-900/10'
    if (isDragActive) return 'bg-blue-50 dark:bg-blue-900/10'
    if (isUploading) return 'bg-green-50 dark:bg-green-900/10'
    return 'bg-gray-50 dark:bg-gray-800'
  }

  const getIcon = () => {
    if (error) return <AlertCircle className="h-12 w-12 text-red-500" />
    if (isUploading) return <CheckCircle className="h-12 w-12 text-green-500" />
    return <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
  }

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${getBorderColor()} ${getBackgroundColor()}
          ${isUploading ? 'cursor-not-allowed' : 'hover:border-blue-400 dark:hover:border-blue-500'}
        `}
        whileHover={!isUploading ? { scale: 1.02 } : {}}
        whileTap={!isUploading ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {getIcon()}
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isUploading ? 'Uploading...' : isDragActive ? 'Drop your file here' : 'Drop your medical report here'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isUploading ? `${uploadProgress}% complete` : 'or click to browse'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <FileText className="h-4 w-4" />
            <span>Supported formats: PDF, JPG, PNG (Max 10MB)</span>
          </div>
        </div>

        {isUploading && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  )
}

export default FileUpload