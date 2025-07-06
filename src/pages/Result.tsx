import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Download, ArrowLeft, Globe, Brain, Heart } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'technical' | 'simple' | 'recommendations'>('simple')
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

    try {
      const element = document.getElementById('report-content')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
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

      pdf.save(`${report.filename}_analysis.pdf`)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Report not found'}</p>
          <Link
            to="/history"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('results.backToHistory')}
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'simple', label: t('results.simpleExplanation'), icon: Globe },
    { id: 'technical', label: t('results.technicalAnalysis'), icon: Brain },
    { id: 'recommendations', label: t('results.recommendations'), icon: Heart }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/history"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Report Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {report.filename}
              </p>
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{t('results.downloadPDF')}</span>
          </button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div id="report-content" className="prose prose-lg max-w-none dark:prose-invert">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="whitespace-pre-wrap"
            >
              {getContent()}
            </motion.div>
          </div>
        </motion.div>

        {/* Report Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.filename}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analyzed on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                {report.status === 'completed' ? 'Completed' : report.status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Medical Disclaimer:</strong> This analysis is for educational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment decisions.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Result