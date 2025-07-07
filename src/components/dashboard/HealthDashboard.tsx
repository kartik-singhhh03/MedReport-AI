import React from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Heart, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Shield
} from 'lucide-react'

interface HealthMetric {
  label: string
  value: string | number
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<any>
}

interface HealthDashboardProps {
  healthScore: number
  metrics: HealthMetric[]
  riskFactors: string[]
  keyFindings: string[]
}

export function HealthDashboard({ 
  healthScore, 
  metrics, 
  riskFactors, 
  keyFindings 
}: HealthDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500'
    if (score >= 60) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-6">AI Health Score</h2>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(71, 85, 105, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#healthGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - healthScore / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{healthScore}</div>
              <div className="text-sm text-slate-400">/ 100</div>
            </div>
          </div>
        </div>
        <p className="text-lg text-slate-300">
          {healthScore >= 80 ? 'Excellent Health' : 
           healthScore >= 60 ? 'Good Health' : 'Needs Attention'}
        </p>
      </motion.div>

      {/* Health Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border ${getStatusColor(metric.status)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className="h-6 w-6" />
              <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(metric.status)}`}>
                {metric.status}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-slate-400">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-white">Risk Factors</h3>
          </div>
          <div className="space-y-2">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-slate-300">{risk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30"
      >
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Key Findings</h3>
        </div>
        <div className="space-y-2">
          {keyFindings.map((finding, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">{finding}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">AI Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300 mb-1">98.7%</div>
            <div className="text-sm text-slate-400">Analysis Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300 mb-1">2.3s</div>
            <div className="text-sm text-slate-400">Processing Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">24</div>
            <div className="text-sm text-slate-400">Parameters Analyzed</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}