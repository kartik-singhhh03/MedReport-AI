import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Brain, 
  TrendingUp,
  Shield,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card } from '../UI/Card'
import FileUpload from '../reports/FileUpload'
import { useAuth } from '../../hooks/useAuth'
import { useReports } from '../../hooks/useReports'
import { AnimatePresence } from 'framer-motion'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { reports, isLoading } = useReports()
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload')

  const stats = {
    totalReports: reports?.length || 0,
    completedReports: reports?.filter(r => r.status === 'completed').length || 0,
    averageHealthScore: reports?.length ? 
      Math.round(reports.reduce((acc, r) => acc + (r.health_score || 0), 0) / reports.length) : 0,
    recentUploads: reports?.filter(r => {
      const uploadDate = new Date(r.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return uploadDate > weekAgo
    }).length || 0
  }

  const handleAnalysisComplete = (result: any) => {
    console.log('Analysis completed:', result)
    // You can add additional logic here, like showing notifications or updating UI
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-400 mt-1">
            Upload your medical reports for AI-powered analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">AI System Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
              <p className="text-sm text-slate-400">Total Reports</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completedReports}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.averageHealthScore}</p>
              <p className="text-sm text-slate-400">Avg Health Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.recentUploads}</p>
              <p className="text-sm text-slate-400">This Week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Features Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span>AI-Powered Analysis Features</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Upload className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Smart OCR</span>
            </div>
            <p className="text-xs text-slate-400">
              Advanced text extraction from PDFs and images with noise removal
            </p>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-white">Medical Validation</span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-checked with BioBERT for accurate medical term recognition
            </p>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-white">AI Insights</span>
            </div>
            <p className="text-xs text-slate-400">
              Gemini Pro powered analysis with personalized recommendations
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload & Analyze
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Report History
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload onAnalysisComplete={handleAnalysisComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReportHistory reports={reports} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Report History Component
interface ReportHistoryProps {
  reports: any[] | undefined
  isLoading: boolean
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ reports, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Card>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Reports Yet</h3>
          <p className="text-slate-400">
            Upload your first medical report to get started with AI analysis
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-white font-medium">{report.filename}</p>
                <p className="text-sm text-slate-400">
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400'
                  : report.status === 'processing'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {report.status}
              </span>
              
              {report.health_score && (
                <span className="text-sm text-slate-400">
                  Score: {report.health_score}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Dashboard