import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface AnalyticsEvent {
  event_type: string
  event_data?: Record<string, any>
  user_id?: string
}

export function useAnalytics() {
  const { user } = useAuth()

  const trackEvent = async (eventType: string, eventData?: Record<string, any>) => {
    try {
      const event: AnalyticsEvent = {
        event_type: eventType,
        event_data: eventData || {},
        user_id: user?.id
      }

      await supabase.from('analytics').insert(event)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  const trackPageView = (page: string) => {
    trackEvent('page_view', { page, timestamp: new Date().toISOString() })
  }

  const trackFileUpload = (fileType: string, fileSize: number) => {
    trackEvent('file_upload', { file_type: fileType, file_size: fileSize })
  }

  const trackAnalysisComplete = (reportId: string, processingTime: number) => {
    trackEvent('analysis_complete', { report_id: reportId, processing_time: processingTime })
  }

  const trackError = (error: string, context?: string) => {
    trackEvent('error', { error_message: error, context })
  }

  return {
    trackEvent,
    trackPageView,
    trackFileUpload,
    trackAnalysisComplete,
    trackError
  }
}