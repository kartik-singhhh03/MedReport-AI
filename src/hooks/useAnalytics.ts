import { useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useLanguage } from '../contexts/LanguageContext'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private isEnabled: boolean = false

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    }

    this.events.push(analyticsEvent)

    // Send to analytics service (mock implementation)
    this.sendToAnalytics(analyticsEvent)
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // In production, send to your analytics service
    console.log('Analytics Event:', event)
    
    // Example: Send to Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, event.properties)
    }
  }

  trackPageView(page: string) {
    this.track('page_view', { page })
  }

  trackFileUpload(fileType: string, fileSize: number) {
    this.track('file_upload', { fileType, fileSize })
  }

  trackAnalysisStart(reportId: string) {
    this.track('analysis_start', { reportId })
  }

  trackAnalysisComplete(reportId: string, duration: number) {
    this.track('analysis_complete', { reportId, duration })
  }

  trackError(error: string, context?: string) {
    this.track('error', { error, context })
  }

  trackFeatureUsage(feature: string) {
    this.track('feature_usage', { feature })
  }

  getEvents() {
    return this.events
  }

  clearEvents() {
    this.events = []
  }
}

const analytics = new Analytics()

export function useAnalytics() {
  const { user } = useAuth()
  const { language } = useLanguage()

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, {
      ...properties,
      userId: user?.id,
      language,
      timestamp: Date.now()
    })
  }, [user?.id, language])

  const trackPageView = useCallback((page: string) => {
    analytics.trackPageView(page)
  }, [])

  const trackFileUpload = useCallback((fileType: string, fileSize: number) => {
    analytics.trackFileUpload(fileType, fileSize)
  }, [])

  const trackAnalysisStart = useCallback((reportId: string) => {
    analytics.trackAnalysisStart(reportId)
  }, [])

  const trackAnalysisComplete = useCallback((reportId: string, duration: number) => {
    analytics.trackAnalysisComplete(reportId, duration)
  }, [])

  const trackError = useCallback((error: string, context?: string) => {
    analytics.trackError(error, context)
  }, [])

  const trackFeatureUsage = useCallback((feature: string) => {
    analytics.trackFeatureUsage(feature)
  }, [])

  return {
    track,
    trackPageView,
    trackFileUpload,
    trackAnalysisStart,
    trackAnalysisComplete,
    trackError,
    trackFeatureUsage,
    getEvents: analytics.getEvents.bind(analytics),
    clearEvents: analytics.clearEvents.bind(analytics)
  }
}