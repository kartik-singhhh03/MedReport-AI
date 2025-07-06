import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import FileUpload from '../components/UI/FileUpload'
import ProgressBar from '../components/UI/ProgressBar'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      setUploadProgress(100)
      clearInterval(progressInterval)

      // Create database record
      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          filename: selectedFile.name,
          file_url: uploadData.path,
          file_type: selectedFile.type,
          status: 'processing'
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Start processing simulation
      setIsProcessing(true)
      setIsUploading(false)
      
      // Simulate processing time
      setTimeout(() => {
        // In a real app, this would be handled by webhook from n8n
        handleProcessingComplete(reportData.id)
      }, 3000)

    } catch (error: any) {
      setError(error.message || 'Upload failed')
      setIsUploading(false)
      toast.error('Upload failed. Please try again.')
    }
  }

  const handleProcessingComplete = async (reportId: string) => {
    try {
      // Simulate AI analysis results
      const mockAnalysis = {
        technical_analysis: `Based on the uploaded medical report, the following observations have been made:

1. **Blood Work Analysis**: The complete blood count (CBC) shows values within normal ranges for most parameters.

2. **Lipid Profile**: Total cholesterol levels are slightly elevated at 210 mg/dL (normal: <200 mg/dL).

3. **Liver Function**: ALT and AST levels are within normal limits, indicating good liver health.

4. **Kidney Function**: Creatinine and BUN levels are normal, suggesting proper kidney function.

5. **Glucose Levels**: Fasting glucose is at 95 mg/dL, which is within the normal range.

**Recommendations for Healthcare Provider Review**: The slightly elevated cholesterol levels warrant discussion with your healthcare provider about dietary modifications or potential medication if lifestyle changes are insufficient.`,

        layman_explanation_en: `**What Your Report Means in Simple Terms**

Good news! Most of your test results look healthy. Here's what we found:

🩸 **Blood Tests**: Your blood cells are healthy and at good levels.

❤️ **Cholesterol**: This is a bit high (210 when it should be under 200). Think of cholesterol like fat in your blood vessels - too much can block them.

🫀 **Liver**: Your liver is working well! It's like your body's cleaning system.

🫘 **Kidneys**: These are filtering your blood properly, like a good water filter.

🍬 **Blood Sugar**: This is normal, so your body is handling sugar well.

**What to do**: Talk to your doctor about the cholesterol. You might need to eat less fried food, exercise more, or take medicine.`,

        layman_explanation_hi: `**आपकी रिपोर्ट का मतलब सरल शब्दों में**

अच्छी खबर! आपके अधिकांश टेस्ट परिणाम स्वस्थ दिख रहे हैं। यहाँ है जो हमें मिला:

🩸 **खून की जांच**: आपके खून की कोशिकाएं स्वस्थ हैं और अच्छे स्तर पर हैं।

❤️ **कोलेस्ट्रॉल**: यह थोड़ा ज्यादा है (210 जबकि 200 से कम होना चाहिए)। कोलेस्ट्रॉल को खून की नलियों में चर्बी की तरह समझें - ज्यादा हो तो रुकावट हो सकती है।

🫀 **लिवर**: आपका लिवर अच्छा काम कर रहा है! यह आपके शरीर की सफाई करने वाला सिस्टम है।

🫘 **किडनी**: ये आपके खून को सही तरीके से साफ कर रहे हैं, जैसे एक अच्छा पानी का फिल्टर।

🍬 **ब्लड शुगर**: यह सामान्य है, तो आपका शरीर चीनी को सही तरीके से संभाल रहा है।

**क्या करना है**: कोलेस्ट्रॉल के बारे में डॉक्टर से बात करें। आपको कम तली चीज़ें खाने, ज्यादा एक्सरसाइज करने या दवा लेने की जरूरत हो सकती है।`,

        recommendations: `**Personalized Health Recommendations**

🥗 **Dietary Changes**:
- Reduce saturated fats (fried foods, red meat)
- Increase fiber intake (oats, beans, fruits)
- Add heart-healthy foods (salmon, nuts, olive oil)
- Limit processed foods and sugary drinks

🏃 **Exercise Plan**:
- 30 minutes of moderate exercise, 5 days a week
- Include both cardio (walking, cycling) and strength training
- Take stairs instead of elevators when possible

💊 **Lifestyle Modifications**:
- Maintain a healthy weight
- Quit smoking if applicable
- Limit alcohol consumption
- Get 7-8 hours of quality sleep

📅 **Follow-up Care**:
- Recheck cholesterol levels in 3 months
- Regular blood pressure monitoring
- Annual comprehensive health checkup

⚠️ **When to Seek Medical Attention**:
- If you experience chest pain or shortness of breath
- Unusual fatigue or weakness
- Any concerns about your medications or symptoms

Remember: These are general recommendations. Always consult with your healthcare provider before making significant changes to your diet or exercise routine.`
      }

      // Update the report with analysis results
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          ...mockAnalysis,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (updateError) throw updateError

      setIsProcessing(false)
      toast.success('Report analysis completed!')
      navigate(`/result/${reportId}`)

    } catch (error: any) {
      setError(error.message || 'Processing failed')
      setIsProcessing(false)
      toast.error('Processing failed. Please try again.')
    }
  }

  const getStatusIcon = () => {
    if (isProcessing) return <Clock className="h-5 w-5 text-yellow-500" />
    if (error) return <AlertCircle className="h-5 w-5 text-red-500" />
    return <CheckCircle className="h-5 w-5 text-green-500" />
  }

  const getStatusText = () => {
    if (isProcessing) return t('dashboard.analyzing')
    if (error) return error
    return t('dashboard.completed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('dashboard.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8"
        >
          {!selectedFile ? (
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={error}
            />
          ) : (
            <div className="space-y-6">
              {/* Selected File Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setError(null)
                      setIsUploading(false)
                      setIsProcessing(false)
                      setUploadProgress(0)
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading...
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {uploadProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={uploadProgress} />
                </div>
              )}

              {/* Processing Status */}
              {(isProcessing || error) && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {isProcessing && <LoadingSpinner size="sm" />}
                  {getStatusIcon()}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getStatusText()}
                  </span>
                </div>
              )}

              {/* Upload Button */}
              {!isUploading && !isProcessing && !error && (
                <button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>{t('common.upload')}</span>
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your medical report in PDF, JPG, or PNG format
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analyze</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI analyzes your report and extracts key medical information
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Understand</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get simple explanations and personalized recommendations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard