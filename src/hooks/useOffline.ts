import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'

interface OfflineData {
  id: string
  type: 'report' | 'analysis' | 'preference'
  data: any
  timestamp: number
  synced: boolean
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineData, setOfflineData] = useState<OfflineData[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const { user } = useAuth()

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load offline data from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`offline_data_${user.id}`)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          setOfflineData(data)
        } catch (error) {
          console.error('Failed to parse offline data:', error)
        }
      }
    }
  }, [user])

  // Save offline data to localStorage
  const saveOfflineData = useCallback((data: OfflineData[]) => {
    if (user) {
      localStorage.setItem(`offline_data_${user.id}`, JSON.stringify(data))
      setOfflineData(data)
    }
  }, [user])

  // Add data to offline queue
  const addToOfflineQueue = useCallback((type: OfflineData['type'], data: any) => {
    if (!user) return

    const offlineItem: OfflineData = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false
    }

    const newOfflineData = [...offlineData, offlineItem]
    saveOfflineData(newOfflineData)
  }, [offlineData, saveOfflineData, user])

  // Sync offline data when back online
  const syncOfflineData = useCallback(async () => {
    if (!isOnline || !user || isSyncing) return

    setIsSyncing(true)
    const unsyncedData = offlineData.filter(item => !item.synced)

    try {
      for (const item of unsyncedData) {
        switch (item.type) {
          case 'report':
            await syncReport(item.data)
            break
          case 'analysis':
            await syncAnalysis(item.data)
            break
          case 'preference':
            await syncPreference(item.data)
            break
        }

        // Mark as synced
        const updatedData = offlineData.map(dataItem =>
          dataItem.id === item.id ? { ...dataItem, synced: true } : dataItem
        )
        saveOfflineData(updatedData)
      }

      // Remove synced data after successful sync
      const remainingData = offlineData.filter(item => !item.synced)
      saveOfflineData(remainingData)

    } catch (error) {
      console.error('Failed to sync offline data:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, user, isSyncing, offlineData, saveOfflineData])

  // Sync report data
  const syncReport = async (data: any) => {
    const { error } = await supabase
      .from('reports')
      .upsert(data, { onConflict: 'id' })

    if (error) throw error
  }

  // Sync analysis data
  const syncAnalysis = async (data: any) => {
    const { error } = await supabase
      .from('reports')
      .update(data)
      .eq('id', data.id)

    if (error) throw error
  }

  // Sync user preferences
  const syncPreference = async (data: any) => {
    const { error } = await supabase
      .from('user_preferences')
      .upsert(data, { onConflict: 'user_id' })

    if (error) throw error
  }

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineData.some(item => !item.synced)) {
      syncOfflineData()
    }
  }, [isOnline, offlineData, syncOfflineData])

  // Get offline queue status
  const getOfflineQueueStatus = useCallback(() => {
    const pending = offlineData.filter(item => !item.synced).length
    const synced = offlineData.filter(item => item.synced).length
    const total = offlineData.length

    return {
      pending,
      synced,
      total,
      hasPending: pending > 0
    }
  }, [offlineData])

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    if (user) {
      localStorage.removeItem(`offline_data_${user.id}`)
      setOfflineData([])
    }
  }, [user])

  // Get cached data for offline viewing
  const getCachedData = useCallback((type: OfflineData['type']) => {
    return offlineData.filter(item => item.type === type)
  }, [offlineData])

  return {
    isOnline,
    isSyncing,
    offlineData,
    addToOfflineQueue,
    syncOfflineData,
    getOfflineQueueStatus,
    clearOfflineData,
    getCachedData
  }
}