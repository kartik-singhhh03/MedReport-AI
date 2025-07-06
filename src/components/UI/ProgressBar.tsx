import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'primary',
  size = 'md',
  showPercentage = true,
  animated = true
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const backgroundColorClasses = {
    primary: 'bg-blue-100 dark:bg-blue-900/20',
    success: 'bg-green-100 dark:bg-green-900/20',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20',
    error: 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="w-full">
      <div className={`w-full ${backgroundColorClasses[color]} rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: "easeInOut" }}
        />
      </div>
      {showPercentage && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar