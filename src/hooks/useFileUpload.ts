import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useReports } from './useReports'
import { toast } from 'react-hot-toast'
import apiService from '../services/apiService'

interface UploadProgress {
  percentage: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  message: string
}

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percentage: 0,
    status: 'uploading',
    message: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuth()
  const { refetchReports } = useReports()

  const uploadFile = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload files')
      return
    }

    setIsUploading(true)
    setUploadProgress({
      percentage: 0,
      status: 'uploading',
      message: 'Starting upload...'
    })

    try {
      // Step 1: Upload file to Supabase Storage
      setUploadProgress({
        percentage: 10,
        status: 'uploading',
        message: 'Uploading file to secure storage...'
      })

      const { fileUrl, fileName } = await apiService.uploadFile(file, user.id)

      setUploadProgress({
        percentage: 30,
        status: 'uploading',
        message: 'File uploaded successfully, creating report...'
      })

      // Step 2: Create report record in database
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          filename: fileName,
          file_url: fileUrl,
          file_type: file.type || 'unknown',
          status: 'processing'
        })
        .select()
        .single()

      if (reportError) {
        throw new Error(`Database error: ${reportError.message}`)
      }

      setUploadProgress({
        percentage: 50,
        status: 'processing',
        message: 'Starting AI analysis...'
      })

      // Step 3: Perform comprehensive AI analysis
      setUploadProgress({
        percentage: 60,
        status: 'processing',
        message: 'Extracting text with OCR...'
      })

      const analysisResult = await apiService.analyzeMedicalReport(file, {
        id: report.id,
        filename: fileName,
        fileUrl: fileUrl,
        fileType: file.type || 'unknown',
        userId: user.id
      })

      setUploadProgress({
        percentage: 80,
        status: 'processing',
        message: 'Saving analysis results...'
      })

      // Step 4: Save analysis results
      await apiService.saveAnalysisResults(report.id, analysisResult, 'Extracted text')

      // Step 5: Update report status
      await supabase
        .from('reports')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString() 
        })
        .eq('id', report.id)

      setUploadProgress({
        percentage: 100,
        status: 'completed',
        message: 'Analysis completed successfully!'
      })

      toast.success('Medical report analyzed successfully!')
      refetchReports()

      return {
        ...report,
        analysis: analysisResult
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress({
        percentage: 0,
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      })
      toast.error('Upload failed. Please try again.')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const resetProgress = () => {
    setUploadProgress({
      percentage: 0,
      status: 'uploading',
      message: ''
    })
  }

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    resetProgress
  }
}