import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Scan, Activity, Zap } from 'lucide-react'

export function SkeletonCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-3/4"></div>
      </div>
    </div>
  )
}

export function ProcessingAnimation() {
  const stages = [
    { icon: Scan, label: 'Scanning document...', color: 'text-cyan-400' },
    { icon: Brain, label: 'AI analysis in progress...', color: 'text-purple-400' },
    { icon: Activity, label: 'Processing biomarkers...', color: 'text-green-400' },
    { icon: Zap, label: 'Generating insights...', color: 'text-orange-400' }
  ]

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.5, duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <stage.icon className={`h-5 w-5 ${stage.color}`} />
          </motion.div>
          <span className="text-slate-300">{stage.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon: React.ComponentType<any>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  )
}