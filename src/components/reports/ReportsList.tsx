import React, { useState } from 'react'
import { FileText, Clock, CheckCircle, XCircle, Eye, Download, Trash2 } from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ReportViewer } from './ReportViewer'
import toast from 'react-hot-toast'
import type { Database } from '../../types/database'

type Report = Database['public']['Tables']['reports']['Row']

export function ReportsList() {
  const { reports, isLoading, deleteReport } = useReports()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowViewer(true)
  }

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport.mutateAsync(reportId)
        toast.success('Report deleted successfully')
      } catch (error) {
        toast.error('Failed to delete report')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
        <p className="text-gray-600">Upload your first medical report to get started with AI analysis.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-6" hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <h3 className="font-medium text-gray-900">{report.filename}</h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(report.status)}
                    <span className="text-sm text-gray-600">{getStatusText(report.status)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Uploaded on {new Date(report.created_at!).toLocaleDateString()}
                </p>

                {report.status === 'completed' && report.layman_explanation_en && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {report.layman_explanation_en.substring(0, 150)}...
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {report.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReport(report.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        size="xl"
        title="Report Analysis"
      >
        {selectedReport && <ReportViewer report={selectedReport} />}
      </Modal>
    </>
  )
}