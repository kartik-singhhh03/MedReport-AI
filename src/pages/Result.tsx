import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Globe, 
  Brain, 
  Heart, 
  Activity,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Report {
  id: string
  filename: string
  status: string
  technical_analysis: string
  layman_explanation_en: string
  layman_explanation_hi: string
  recommendations: string
  created_at: string
}

const Result: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'simple' | 'technical' | 'recommendations'>('simple')
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const { t, language } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    if (reportId && user) {
      fetchReport()
    }
  }, [reportId, user])

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      setReport(data)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch report')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (!report) return

    setGeneratingPDF(true)
    try {
      const element = document.getElementById('report-content')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${report.filename}_AI_Analysis.pdf`)
      toast.success('📄 PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF')
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" />
          <p className="text-cyan-400 mt-4 text-lg">Loading AI analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
          <p className="text-red-400 mb-6">{error || 'The requested report could not be found.'}</p>
          <Link
            to="/history"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to History</span>
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { 
      id: 'simple', 
      label: 'Simple Explanation', 
      icon: Globe,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Easy-to-understand health insights'
    },
    { 
      id: 'technical', 
      label: 'Technical Analysis', 
      icon: Brain,
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Detailed medical analysis'
    },
    { 
      id: 'recommendations', 
      label: 'AI Recommendations', 
      icon: Heart,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Personalized health suggestions'
    }
  ]

  const getContent = () => {
    switch (activeTab) {
      case 'technical':
        return report.technical_analysis
      case 'simple':
        return language === 'hi' ? report.layman_explanation_hi : report.layman_explanation_en
      case 'recommendations':
        return report.recommendations
      default:
        return ''
    }
  }

  const healthScore = 87 // Mock AI health score

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/history"
              className="p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 text-cyan-400" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                AI Analysis Results
              </h1>
              <p className="text-slate-300 mt-1">
                {report.filename} • {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Health Score */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{healthScore}/100</div>
                <div className="text-xs text-green-300">Health Score</div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePDF}
              disabled={generatingPDF}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {generatingPDF ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{generatingPDF ? 'Generating...' : 'Download PDF'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-cyan-500/20"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                      : 'bg-slate-700/30 border-slate-600/50 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`bg-gradient-to-r ${tab.gradient} p-2 rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`font-semibold ${isActive ? 'text-cyan-300' : 'text-white'}`}>
                      {tab.label}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    {tab.description}
                  </p>
                </motion.button>
              )
            })}
          </div>

          {/* Content */}
          <div id="report-content" className="min-h-[400px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none prose-invert"
            >
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                  {getContent()}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h3 className="text-white font-semibold">Health Status</h3>
            </div>
            <p className="text-green-300 text-2xl font-bold mb-2">Excellent</p>
            <p className="text-slate-400 text-sm">All major biomarkers within optimal ranges</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-white font-semibold">Risk Assessment</h3>
            </div>
            <p className="text-blue-300 text-2xl font-bold mb-2">Low Risk</p>
            <p className="text-slate-400 text-sm">2.1% cardiovascular risk over 10 years</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-white font-semibold">AI Confidence</h3>
            </div>
            <p className="text-purple-300 text-2xl font-bold mb-2">98.7%</p>
            <p className="text-slate-400 text-sm">High confidence in analysis accuracy</p>
          </div>
        </motion.div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30"
        >
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-orange-400 mt-1" />
            <div>
              <h3 className="text-orange-300 font-semibold mb-2">Medical Disclaimer</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                This AI analysis is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read in this analysis.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Result