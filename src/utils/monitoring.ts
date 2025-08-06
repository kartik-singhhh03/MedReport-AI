import { useAnalytics } from '../hooks/useAnalytics'

// Monitoring configuration
const MONITORING_CONFIG = {
  ERROR_SAMPLING_RATE: 1.0, // 100% in development, lower in production
  PERFORMANCE_SAMPLING_RATE: 0.1, // 10% of users
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_ERRORS_PER_SESSION: 10,
  FLUSH_INTERVAL: 30 * 1000, // 30 seconds
}

// Error tracking
interface ErrorEvent {
  id: string
  timestamp: number
  message: string
  stack?: string
  component?: string
  userId?: string
  sessionId: string
  url: string
  userAgent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

class ErrorTracker {
  private errors: ErrorEvent[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private setupGlobalErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        severity: 'medium'
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        severity: 'high'
      })
    })
  }

  trackError(error: {
    message: string
    stack?: string
    component?: string
    userId?: string
    severity?: 'low' | 'medium' | 'high' | 'critical'
    context?: Record<string, any>
    url?: string
    lineNumber?: number
    columnNumber?: number
  }): void {
    // Apply sampling
    if (Math.random() > MONITORING_CONFIG.ERROR_SAMPLING_RATE) {
      return
    }

    // Limit errors per session
    if (this.errors.length >= MONITORING_CONFIG.MAX_ERRORS_PER_SESSION) {
      return
    }

    const errorEvent: ErrorEvent = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      component: error.component,
      userId: error.userId,
      sessionId: this.sessionId,
      url: error.url || window.location.href,
      userAgent: navigator.userAgent,
      severity: error.severity || 'medium',
      context: error.context
    }

    this.errors.push(errorEvent)
    this.flushErrors()
  }

  private flushErrors(): void {
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, etc.
      console.log('Errors to flush:', this.errors)
      this.errors = []
    }
  }
}

export const errorTracker = new ErrorTracker()

// Performance monitoring
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  context?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: Map<string, PerformanceObserver> = new Map()

  constructor() {
    this.setupPerformanceObservers()
  }

  private setupPerformanceObservers(): void {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms')
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'ms')
            this.recordMetric('first_paint', navEntry.responseStart - navEntry.fetchStart, 'ms')
          }
        })
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.set('navigation', navigationObserver)
    }

    // Observe resource timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            this.recordMetric('resource_load_time', resourceEntry.responseEnd - resourceEntry.fetchStart, 'ms', {
              name: resourceEntry.name,
              type: resourceEntry.initiatorType
            })
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.set('resource', resourceObserver)
    }

    // Observe long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'longtask') {
            this.recordMetric('long_task_duration', entry.duration, 'ms', {
              startTime: entry.startTime,
              name: entry.name
            })
          }
        })
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      this.observers.set('longtask', longTaskObserver)
    }
  }

  recordMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    // Apply sampling
    if (Math.random() > MONITORING_CONFIG.PERFORMANCE_SAMPLING_RATE) {
      return
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context
    }

    this.metrics.push(metric)
    this.flushMetrics()
  }

  private flushMetrics(): void {
    // In production, send to performance monitoring service
    if (import.meta.env.PROD) {
      console.log('Metrics to flush:', this.metrics)
      this.metrics = []
    }
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()

// User behavior tracking
interface UserEvent {
  type: string
  timestamp: number
  userId?: string
  sessionId: string
  url: string
  data?: Record<string, any>
}

class UserBehaviorTracker {
  private events: UserEvent[] = []
  private sessionId: string
  private analytics = useAnalytics()

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupEventListeners()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private setupEventListeners(): void {
    // Track page views
    let lastUrl = window.location.href
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        this.trackEvent('page_view', { url: window.location.href })
        lastUrl = window.location.href
      }
    })
    observer.observe(document, { subtree: true, childList: true })

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.trackEvent('click', {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim(),
          href: (target as HTMLAnchorElement).href
        })
      }
    })

    // Track form interactions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackEvent('form_submit', {
        formId: form.id,
        formAction: form.action
      })
    })

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.trackEvent('scroll_depth', { depth: scrollDepth })
        }
      }
    })
  }

  trackEvent(type: string, data?: Record<string, any>): void {
    const event: UserEvent = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      data
    }

    this.events.push(event)
    this.flushEvents()
  }

  private flushEvents(): void {
    // In production, send to analytics service
    if (import.meta.env.PROD) {
      console.log('Events to flush:', this.events)
      this.events = []
    }
  }
}

export const userBehaviorTracker = new UserBehaviorTracker()

// Health checks
interface HealthCheck {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
  details?: Record<string, any>
}

class HealthMonitor {
  private checks: HealthCheck[] = []

  async performHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = []

    // Check API connectivity
    try {
      const startTime = Date.now()
      const response = await fetch('/api/health', { method: 'GET' })
      const responseTime = Date.now() - startTime
      
      checks.push({
        name: 'api_connectivity',
        status: response.ok ? 'healthy' : 'unhealthy',
        timestamp: Date.now(),
        details: {
          statusCode: response.status,
          responseTime
        }
      })
    } catch (error) {
      checks.push({
        name: 'api_connectivity',
        status: 'unhealthy',
        timestamp: Date.now(),
        details: { error: error.message }
      })
    }

    // Check storage availability
    try {
      localStorage.setItem('health_check', 'test')
      localStorage.removeItem('health_check')
      checks.push({
        name: 'local_storage',
        status: 'healthy',
        timestamp: Date.now()
      })
    } catch (error) {
      checks.push({
        name: 'local_storage',
        status: 'unhealthy',
        timestamp: Date.now(),
        details: { error: error.message }
      })
    }

    // Check memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      
      checks.push({
        name: 'memory_usage',
        status: memoryUsage < 0.8 ? 'healthy' : memoryUsage < 0.9 ? 'degraded' : 'unhealthy',
        timestamp: Date.now(),
        details: {
          used: memory.usedJSHeapSize,
          total: memory.jsHeapSizeLimit,
          percentage: Math.round(memoryUsage * 100)
        }
      })
    }

    this.checks = checks
    return checks
  }

  getHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    if (this.checks.length === 0) return 'healthy'
    
    const unhealthyCount = this.checks.filter(check => check.status === 'unhealthy').length
    const degradedCount = this.checks.filter(check => check.status === 'degraded').length
    
    if (unhealthyCount > 0) return 'unhealthy'
    if (degradedCount > 0) return 'degraded'
    return 'healthy'
  }
}

export const healthMonitor = new HealthMonitor()

// Monitoring utilities
export const trackError = (error: Error, context?: Record<string, any>): void => {
  errorTracker.trackError({
    message: error.message,
    stack: error.stack,
    context
  })
}

export const trackPerformance = (name: string, value: number, unit: string = 'ms', context?: Record<string, any>): void => {
  performanceMonitor.recordMetric(name, value, unit, context)
}

export const trackUserEvent = (type: string, data?: Record<string, any>): void => {
  userBehaviorTracker.trackEvent(type, data)
}

export const getHealthStatus = async (): Promise<'healthy' | 'degraded' | 'unhealthy'> => {
  await healthMonitor.performHealthChecks()
  return healthMonitor.getHealthStatus()
}

// Cleanup function
export const cleanupMonitoring = (): void => {
  performanceMonitor.disconnect()
}

export default {
  errorTracker,
  performanceMonitor,
  userBehaviorTracker,
  healthMonitor,
  trackError,
  trackPerformance,
  trackUserEvent,
  getHealthStatus,
  cleanupMonitoring
}