import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()

  const uploadFile = async (file: File) => {
    if (!user) throw new Error('User not authenticated')

    setUploading(true)
    setProgress(0)

    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, JPEG, or PNG files only.')
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(fileName)

      setProgress(100)
      
      return {
        fileName: file.name,
        filePath: data.path,
        fileUrl: publicUrl,
        fileType: file.type,
      }
    } catch (error) {
      throw error
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return {
    uploadFile,
    uploading,
    progress,
  }
}