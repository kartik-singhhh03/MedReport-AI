import React, { useState } from 'react'
import { FileText, Globe, Stethoscope, Lightbulb, Download, Share2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLanguage } from '../../contexts/LanguageContext'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import type { Database } from '../../types/database'

type Report = Database['public']['Tables']['reports']['Row']

interface ReportViewerProps {
  report: Report
}

export function ReportViewer({ report }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<'simple' | 'technical' | 'recommendations'>('simple')
  const { language } = useLanguage()
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const tabs = [
    { id: 'simple', label: 'Simple Explanation', icon: Globe },
    { id: 'technical', label: 'Technical Analysis', icon: Stethoscope },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ]

  const getContent = () => {
    switch (activeTab) {
      case 'simple':
        return language === 'en' ? report.layman_explanation_en : report.layman_explanation_hi
      case 'technical':
        return report.technical_analysis
      case 'recommendations':
        return report.recommendations
      default:
        return ''
    }
  }

  const generatePDF = async () => {
    setGeneratingPDF(true)
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
    } finally {
      setGeneratingPDF(false)
    }
  }

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Medical Report Analysis - ${report.filename}`,
          text: 'Check out my medical report analysis from MediSimplify',
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">{report.filename}</h3>
            <p className="text-sm text-gray-600">
              Analyzed on {new Date(report.updated_at!).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareReport}
          >
            <Share2 size={16} className="mr-1" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            loading={generatingPDF}
          >
            <Download size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div id="report-content" className="prose max-w-none">
        <div className="bg-gray-50 rounded-lg p-6">
          {getContent() ? (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {getContent()}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No content available for this section.</p>
              <p className="text-sm mt-2">The AI analysis may still be processing.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Analyzed by GPT-4 AI • For educational purposes only</span>
      </div>
    </div>
  )
}