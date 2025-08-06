import { useEffect, useCallback, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

interface PerformanceObserver {
  observe: (entry: any) => void
  disconnect: () => void
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0
  })

  const [isMonitoring, setIsMonitoring] = useState(false)

  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        setMetrics(prev => ({ ...prev, loadTime }))
        return loadTime
      }
    }
    return 0
  }, [])

  const measureFirstContentfulPaint = useCallback(() => {
    return new Promise<number>((resolve) => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcp) {
            setMetrics(prev => ({ ...prev, firstContentfulPaint: fcp.startTime }))
            resolve(fcp.startTime)
            observer.disconnect()
          }
        })
        
        observer.observe({ entryTypes: ['paint'] })
      } else {
        resolve(0)
      }
    })
  }, [])

  const measureLargestContentfulPaint = useCallback(() => {
    return new Promise<number>((resolve) => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        let lcp = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            lcp = lastEntry.startTime
            setMetrics(prev => ({ ...prev, largestContentfulPaint: lcp }))
          }
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Stop observing after 5 seconds
        setTimeout(() => {
          observer.disconnect()
          resolve(lcp)
        }, 5000)
      } else {
        resolve(0)
      }
    })
  }, [])

  const measureCumulativeLayoutShift = useCallback(() => {
    return new Promise<number>((resolve) => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        let cls = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          })
          setMetrics(prev => ({ ...prev, cumulativeLayoutShift: cls }))
        })
        
        observer.observe({ entryTypes: ['layout-shift'] })
        
        // Stop observing after 5 seconds
        setTimeout(() => {
          observer.disconnect()
          resolve(cls)
        }, 5000)
      } else {
        resolve(0)
      }
    })
  }, [])

  const measureFirstInputDelay = useCallback(() => {
    return new Promise<number>((resolve) => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fid = entries.find(entry => entry.name === 'first-input')
          if (fid) {
            const delay = fid.processingStart - fid.startTime
            setMetrics(prev => ({ ...prev, firstInputDelay: delay }))
            resolve(delay)
            observer.disconnect()
          }
        })
        
        observer.observe({ entryTypes: ['first-input'] })
      } else {
        resolve(0)
      }
    })
  }, [])

  const measureTimeToInteractive = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const tti = navigation.domContentLoadedEventEnd - navigation.fetchStart
        setMetrics(prev => ({ ...prev, timeToInteractive: tti }))
        return tti
      }
    }
    return 0
  }, [])

  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true)
    
    // Measure all metrics
    const loadTime = measureLoadTime()
    const fcp = await measureFirstContentfulPaint()
    const lcp = await measureLargestContentfulPaint()
    const cls = await measureCumulativeLayoutShift()
    const fid = await measureFirstInputDelay()
    const tti = measureTimeToInteractive()

    // Log performance metrics
    console.log('Performance Metrics:', {
      loadTime,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid,
      timeToInteractive: tti
    })

    return {
      loadTime,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid,
      timeToInteractive: tti
    }
  }, [measureLoadTime, measureFirstContentfulPaint, measureLargestContentfulPaint, measureCumulativeLayoutShift, measureFirstInputDelay, measureTimeToInteractive])

  const getPerformanceScore = useCallback(() => {
    let score = 100

    // Deduct points based on performance metrics
    if (metrics.loadTime > 3000) score -= 20
    if (metrics.firstContentfulPaint > 2000) score -= 15
    if (metrics.largestContentfulPaint > 4000) score -= 20
    if (metrics.cumulativeLayoutShift > 0.1) score -= 15
    if (metrics.firstInputDelay > 100) score -= 10
    if (metrics.timeToInteractive > 5000) score -= 20

    return Math.max(0, score)
  }, [metrics])

  const getPerformanceGrade = useCallback(() => {
    const score = getPerformanceScore()
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }, [getPerformanceScore])

  useEffect(() => {
    // Start monitoring when component mounts
    startMonitoring()
  }, [startMonitoring])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    getPerformanceScore,
    getPerformanceGrade,
    measureLoadTime,
    measureFirstContentfulPaint,
    measureLargestContentfulPaint,
    measureCumulativeLayoutShift,
    measureFirstInputDelay,
    measureTimeToInteractive
  }
}

export function useMemoryMonitor() {
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        })
      }
    }

    const interval = setInterval(checkMemory, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])
}