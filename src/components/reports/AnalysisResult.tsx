import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Stethoscope, 
  Lightbulb, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'
import { Card } from '../UI/Card'
import { Button } from '../UI/Button'
import { ProgressBar } from '../UI/ProgressBar'

interface AnalysisResultProps {
  analysis: {
    simpleExplanation: string
    technicalAnalysis: string
    aiRecommendations: string
    healthScore: number
    riskLevel: 'low' | 'moderate' | 'high' | 'critical'
    keyFindings: string[]
    biomarkers: Record<string, any>
    confidence: number
    processingTime: number
  }
  fileName: string
  onDownload?: () => void
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  analysis, 
  fileName, 
  onDownload 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    simple: true,
    technical: false,
    recommendations: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'moderate':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />
      case 'high':
        return <AlertTriangle className="h-5 w-5" />
      case 'moderate':
        return <Clock className="h-5 w-5" />
      case 'low':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const formatProcessingTime = (time: number) => {
    if (time < 1000) return `${time}ms`
    return `${(time / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-6">
      {/* Header with Health Score and Risk Level */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Analysis Results
              </h3>
              <p className="text-sm text-slate-400">{fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Health Score */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {analysis.healthScore}
              </div>
              <div className="text-xs text-slate-400">Health Score</div>
            </div>
            
            {/* Risk Level */}
            <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getRiskLevelColor(analysis.riskLevel)}`}>
              {getRiskLevelIcon(analysis.riskLevel)}
              <span className="capitalize">{analysis.riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Health Score Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Health Score</span>
            <span>{analysis.healthScore}/100</span>
          </div>
          <ProgressBar 
            value={analysis.healthScore} 
            max={100}
            className="h-2"
          />
        </div>

        {/* Processing Info */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Processed in {formatProcessingTime(analysis.processingTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>{analysis.confidence}% confidence</span>
          </div>
        </div>
      </Card>

      {/* Key Findings */}
      {analysis.keyFindings.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Key Findings</span>
          </h4>
          <div className="space-y-2">
            {analysis.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-slate-300">{finding}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Simple Explanation */}
        <Card className="overflow-hidden">
          <button
            onClick={() => toggleSection('simple')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  Simple Explanation
                </h4>
                <p className="text-sm text-slate-400">
                  Easy-to-understand summary
                </p>
              </div>
            </div>
            {expandedSections.simple ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.simple && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.simpleExplanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Technical Analysis */}
        <Card className="overflow-hidden">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Stethoscope className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  Technical Analysis
                </h4>
                <p className="text-sm text-slate-400">
                  Detailed medical findings
                </p>
              </div>
            </div>
            {expandedSections.technical ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.technical && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.technicalAnalysis}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* AI Recommendations */}
        <Card className="overflow-hidden">
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Lightbulb className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  AI Recommendations
                </h4>
                <p className="text-sm text-slate-400">
                  Personalized guidance
                </p>
              </div>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.recommendations && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.aiRecommendations}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Biomarkers Section */}
      {Object.keys(analysis.biomarkers).length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Biomarkers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.biomarkers).map(([key, biomarker]) => (
              <div key={key} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    biomarker.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                    biomarker.status === 'elevated' ? 'bg-yellow-500/20 text-yellow-400' :
                    biomarker.status === 'low' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {biomarker.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {biomarker.value} {biomarker.unit}
                </div>
                <div className="text-xs text-slate-400">
                  Normal: {biomarker.normal}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Download Button */}
      {onDownload && (
        <div className="flex justify-center">
          <Button
            onClick={onDownload}
            variant="primary"
            size="lg"
            icon={<Download className="h-5 w-5" />}
            className="px-8"
          >
            Download Analysis Report
          </Button>
        </div>
      )}
    </div>
  )
}

export default AnalysisResult 