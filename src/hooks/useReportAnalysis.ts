import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useReportAnalysis() {
  const [analyzing, setAnalyzing] = useState(false)

  const analyzeReport = async (reportId: string) => {
    setAnalyzing(true)
    
    try {
      // Call the edge function to analyze the report
      const { data, error } = await supabase.functions.invoke('analyze-report', {
        body: { reportId }
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze report. Please try again.')
      throw error
    } finally {
      setAnalyzing(false)
    }
  }

  return {
    analyzeReport,
    analyzing
  }
}