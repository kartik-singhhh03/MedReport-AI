import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useOffline } from '../../hooks/useOffline'

export function OfflineIndicator() {
  const isOnline = useOffline()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-red-400/50"
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">You are offline</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}