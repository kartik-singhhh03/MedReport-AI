import { useEffect, useRef } from 'react'

export function usePerformance(name: string) {
  const startTime = useRef<number>()

  useEffect(() => {
    startTime.current = performance.now()
    
    return () => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current
        console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`)
        
        // Send to analytics in production
        if (import.meta.env.PROD) {
          // analytics.track('performance', { name, duration })
        }
      }
    }
  }, [name])

  const mark = (label: string) => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current
      console.log(`Performance [${name}] ${label}: ${duration.toFixed(2)}ms`)
    }
  }

  return { mark }
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