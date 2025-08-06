import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, FileText, Brain, Zap, Activity } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'cyan'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'text-cyan-500',
    white: 'text-white',
    cyan: 'text-cyan-400'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <p className="text-slate-400 mt-2 text-sm">{text}</p>
      )}
    </div>
  )
}

interface ProcessingStepsProps {
  currentStep: number
  steps: Array<{
    icon: React.ComponentType<any>
    label: string
    description: string
  }>
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  currentStep,
  steps
}) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isPending = index > currentStep

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
              isActive
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : isCompleted
                ? 'bg-green-500/10 border-green-500/30 text-green-300'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              isActive
                ? 'bg-cyan-500/20'
                : isCompleted
                ? 'bg-green-500/20'
                : 'bg-slate-600/50'
            }`}>
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{step.label}</h3>
              <p className="text-sm opacity-75">{step.description}</p>
            </div>

            {isActive && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
  variant?: 'text' | 'card' | 'avatar' | 'button'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 1,
  variant = 'text'
}) => {
  const baseClasses = 'animate-pulse bg-slate-700/50 rounded'

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} h-4 ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} p-6 ${className}`}>
        <div className="space-y-3">
          <div className="h-4 bg-slate-600/50 rounded w-3/4" />
          <div className="h-3 bg-slate-600/50 rounded w-full" />
          <div className="h-3 bg-slate-600/50 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={`${baseClasses} w-12 h-12 rounded-full ${className}`} />
    )
  }

  if (variant === 'button') {
    return (
      <div className={`${baseClasses} h-10 w-24 ${className}`} />
    )
  }

  return null
}

interface PageLoaderProps {
  title?: string
  subtitle?: string
  showProgress?: boolean
  progress?: number
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  title = 'Loading...',
  subtitle = 'Please wait while we prepare your experience',
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <Brain className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-300 mb-6">{subtitle}</p>

        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-slate-700 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-slate-400">{progress}% complete</p>
          </div>
        )}

        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-cyan-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner