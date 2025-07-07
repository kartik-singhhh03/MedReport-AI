// Production monitoring and error tracking
import * as Sentry from '@sentry/react'

export function initializeMonitoring() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV || 'production',
      tracesSampleRate: 0.1,
      beforeSend(event) {
        // Filter out sensitive information
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.value?.includes('password') || error?.value?.includes('token')) {
            return null
          }
        }
        return event
      }
    })
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error)
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context })
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`)
  
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level)
  }
}

export function setUserContext(user: { id: string; email: string }) {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: user.id,
      email: user.email
    })
  }
}