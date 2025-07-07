import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('🌐 Connection restored!')
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('📡 You are offline. Some features may not work.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}