import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react'
import { useOffline } from '../../hooks/useOffline'
import toast from 'react-hot-toast'

const OfflineIndicator: React.FC = () => {
  const { isOnline, isSyncing, getOfflineQueueStatus } = useOffline()
  const [showDetails, setShowDetails] = React.useState(false)

  const queueStatus = getOfflineQueueStatus()

  React.useEffect(() => {
    if (!isOnline) {
      toast.error('📡 You are offline. Some features may not work.', {
        duration: 4000,
        icon: '📡'
      })
    } else if (queueStatus.hasPending) {
      toast.success('🌐 Connection restored! Syncing offline data...', {
        duration: 3000,
        icon: '🌐'
      })
    }
  }, [isOnline, queueStatus.hasPending])

  if (isOnline && !queueStatus.hasPending) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-xl border-b border-red-400/30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-white" />
                ) : (
                  <WifiOff className="h-5 w-5 text-white" />
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {isOnline ? 'Syncing offline data...' : 'You are offline'}
                  </span>
                  
                  {isSyncing && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {queueStatus.hasPending && (
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{queueStatus.pending} pending</span>
                  </div>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-white/80 hover:text-white text-sm underline"
                >
                  {showDetails ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-red-400/30"
                >
                  <div className="text-white/80 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Connection Status:</span>
                      <span className={isOnline ? 'text-green-300' : 'text-red-300'}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    
                    {queueStatus.hasPending && (
                      <>
                        <div className="flex justify-between">
                          <span>Pending Items:</span>
                          <span>{queueStatus.pending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Synced Items:</span>
                          <span>{queueStatus.synced}</span>
                        </div>
                      </>
                    )}
                    
                    {!isOnline && (
                      <div className="bg-red-600/20 rounded-lg p-3 mt-2">
                        <p className="text-xs">
                          Some features may be limited while offline. Your data will be synced when you're back online.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OfflineIndicator