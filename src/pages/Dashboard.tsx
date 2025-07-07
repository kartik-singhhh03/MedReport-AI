import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, AlertCircle, Brain, Zap, Activity, Upload, Scan } from 'lucide-react'
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
  const [processingStage, setProcessingStage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const processingStages = [
    { stage: 'ocr', label: 'Extracting text with OCR...', icon: Scan },
    { stage: 'nlp', label: 'Processing with NLP...', icon: Brain },
    { stage: 'prediction', label: 'Running disease prediction...', icon: Activity },
    { stage: 'recommendations', label: 'Generating recommendations...', icon: Zap }
  ]

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

      // Start AI processing simulation
      setIsProcessing(true)
      setIsUploading(false)
      
      // Simulate AI processing stages
      for (let i = 0; i < processingStages.length; i++) {
        setProcessingStage(processingStages[i].stage)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // Complete processing
      await handleProcessingComplete(reportData.id)

    } catch (error: any) {
      setError(error.message || 'Upload failed')
      setIsUploading(false)
      toast.error('Upload failed. Please try again.')
    }
  }

  const handleProcessingComplete = async (reportId: string) => {
    try {
      // Enhanced mock analysis with AI features
      const mockAnalysis = {
        technical_analysis: `**Advanced AI Medical Analysis Report**

**OCR Data Extraction Results:**
- Document Type: Laboratory Blood Test Report
- Extraction Accuracy: 98.7%
- Key Parameters Identified: 24 biomarkers

**Clinical Findings:**
1. **Hematology Panel**:
   - Hemoglobin: 13.2 g/dL (Normal: 12.0-15.5 g/dL)
   - White Blood Cell Count: 7,200/μL (Normal: 4,000-11,000/μL)
   - Platelet Count: 285,000/μL (Normal: 150,000-450,000/μL)

2. **Metabolic Panel**:
   - Glucose (Fasting): 98 mg/dL (Normal: 70-100 mg/dL)
   - Total Cholesterol: 195 mg/dL (Optimal: <200 mg/dL)
   - HDL Cholesterol: 52 mg/dL (Good: >40 mg/dL men, >50 mg/dL women)
   - LDL Cholesterol: 118 mg/dL (Optimal: <100 mg/dL)

3. **Liver Function**:
   - ALT: 28 U/L (Normal: 7-56 U/L)
   - AST: 24 U/L (Normal: 10-40 U/L)
   - Bilirubin Total: 0.8 mg/dL (Normal: 0.3-1.2 mg/dL)

4. **Kidney Function**:
   - Creatinine: 0.9 mg/dL (Normal: 0.6-1.2 mg/dL)
   - BUN: 15 mg/dL (Normal: 7-20 mg/dL)
   - eGFR: >60 mL/min/1.73m² (Normal: >60)

**AI Risk Assessment:**
- Cardiovascular Risk: Low (2.1% 10-year risk)
- Diabetes Risk: Very Low (0.8% 5-year risk)
- Metabolic Syndrome: Not Present
- Overall Health Score: 87/100 (Excellent)

**Machine Learning Insights:**
Based on pattern analysis of 50,000+ similar profiles, your biomarker constellation suggests optimal metabolic health with excellent cardiovascular protection.`,

        layman_explanation_en: `**🩺 Your Health Report Made Simple**

**Great News! Your Results Look Excellent! 🎉**

**🩸 Blood Health:**
Your blood cells are healthy and working perfectly! Think of your blood as a delivery system - it's carrying oxygen and nutrients efficiently throughout your body.

**❤️ Heart Health:**
Your cholesterol levels are in the "green zone"! Your heart and blood vessels are well-protected. It's like having clean, smooth highways for your blood to travel.

**🍬 Sugar Levels:**
Your blood sugar is perfect! Your body is handling sugar like a well-tuned engine - taking in just what it needs and storing the rest properly.

**🫀 Liver & Kidneys:**
These are your body's cleaning crew, and they're doing an amazing job! Your liver is processing everything smoothly, and your kidneys are filtering your blood perfectly.

**🤖 AI Health Score: 87/100 (Excellent!)**

**What This Means:**
- Your body is functioning like a well-oiled machine
- Very low risk of heart problems or diabetes
- Your lifestyle choices are working great!
- Keep doing what you're doing!

**🎯 Key Takeaway:**
You're in excellent health! Your body is working efficiently, and all your major systems are functioning optimally.`,

        layman_explanation_hi: `**🩺 आपकी स्वास्थ्य रिपोर्ट सरल भाषा में**

**बहुत अच्छी खबर! आपके परिणाम बेहतरीन हैं! 🎉**

**🩸 खून की सेहत:**
आपके खून की कोशिकाएं स्वस्थ हैं और बिल्कुल सही तरीके से काम कर रही हैं! आपका खून एक अच्छी डिलीवरी सिस्टम की तरह है - यह पूरे शरीर में ऑक्सीजन और पोषक तत्व पहुंचा रहा है।

**❤️ दिल की सेहत:**
आपका कोलेस्ट्रॉल "हरे जोन" में है! आपका दिल और रक्त नलिकाएं अच्छी तरह सुरक्षित हैं। यह साफ, चिकनी सड़कों की तरह है जिस पर आपका खून आसानी से चल सकता है।

**🍬 शुगर का स्तर:**
आपका ब्लड शुगर बिल्कुल सही है! आपका शरीर चीनी को एक अच्छे इंजन की तरह संभाल रहा है - जितनी जरूरत है उतनी ले रहा है और बाकी को सही तरीके से स्टोर कर रहा है।

**🫀 लिवर और किडनी:**
ये आपके शरीर की सफाई करने वाली टीम हैं, और ये शानदार काम कर रहे हैं! आपका लिवर सब कुछ आसानी से प्रोसेस कर रहा है, और आपकी किडनी खून को बिल्कुल सही तरीके से साफ कर रही है।

**🤖 AI स्वास्थ्य स्कोर: 87/100 (उत्कृष्ट!)**

**इसका मतलब क्या है:**
- आपका शरीर एक अच्छी तरह तेल लगी मशीन की तरह काम कर रहा है
- दिल की समस्याओं या डायबिटीज का बहुत कम खतरा
- आपकी जीवनशैली के विकल्प बहुत अच्छे काम कर रहे हैं!
- जो कर रहे हैं वो करते रहें!

**🎯 मुख्य बात:**
आप बेहतरीन सेहत में हैं! आपका शरीर कुशलता से काम कर रहा है, और आपके सभी मुख्य सिस्टम बेहतरीन तरीके से काम कर रहे हैं।`,

        recommendations: `**🎯 Personalized AI Health Recommendations**

**🏃‍♂️ Exercise & Activity:**
- Continue your current activity level (appears optimal)
- Add 2-3 strength training sessions per week
- Consider yoga or meditation for stress management
- Target: 150 minutes moderate exercise weekly

**🥗 Nutrition Optimization:**
- Increase omega-3 rich foods (salmon, walnuts, flaxseeds)
- Add more colorful vegetables (aim for 5-7 servings daily)
- Consider Mediterranean diet patterns
- Limit processed foods and added sugars

**💊 Preventive Care:**
- Annual comprehensive health screening
- Vitamin D level check (if not done recently)
- Blood pressure monitoring every 6 months
- Dental checkup every 6 months

**🧘‍♀️ Lifestyle Enhancements:**
- Maintain 7-9 hours of quality sleep
- Practice stress reduction techniques
- Stay hydrated (8-10 glasses water daily)
- Limit alcohol consumption

**📅 Follow-up Schedule:**
- Next blood work: 12 months
- Cardiovascular screening: Annual
- Cancer screening: Age-appropriate intervals
- Specialist consultation: Not needed currently

**🚨 When to Seek Medical Attention:**
- Unusual fatigue or weakness
- Chest pain or shortness of breath
- Significant weight changes
- Any new concerning symptoms

**🤖 AI Prediction Model Results:**
Based on your current health profile and lifestyle factors:
- 10-year cardiovascular risk: 2.1% (Very Low)
- 5-year diabetes risk: 0.8% (Very Low)
- Metabolic age: 3 years younger than chronological age

**💡 Smart Health Tips:**
- Your biomarker pattern suggests excellent metabolic flexibility
- Consider genetic testing for personalized nutrition insights
- Track sleep quality and stress levels
- Maintain current healthy habits - they're working perfectly!

Remember: These recommendations are AI-generated based on your current results. Always consult with your healthcare provider for personalized medical advice.`
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
      toast.success('🎉 AI Analysis Complete! Your health insights are ready.')
      navigate(`/result/${reportId}`)

    } catch (error: any) {
      setError(error.message || 'Processing failed')
      setIsProcessing(false)
      toast.error('Processing failed. Please try again.')
    }
  }

  const getCurrentStage = () => {
    const current = processingStages.find(s => s.stage === processingStage)
    return current || processingStages[0]
  }

  const getStatusIcon = () => {
    if (isProcessing) return <Clock className="h-5 w-5 text-cyan-400" />
    if (error) return <AlertCircle className="h-5 w-5 text-red-400" />
    return <CheckCircle className="h-5 w-5 text-green-400" />
  }

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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6 backdrop-blur-sm border border-cyan-500/30">
            <Brain className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Medical Analysis
          </h1>
          <p className="text-xl text-slate-300">
            Upload your medical report for advanced AI-powered insights
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-cyan-500/20"
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
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {selectedFile.name}
                      </p>
                      <p className="text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
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
                    className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-cyan-300">
                      Uploading to secure cloud...
                    </span>
                    <span className="text-sm text-slate-400">
                      {uploadProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={uploadProgress} color="primary" />
                </div>
              )}

              {/* AI Processing Status */}
              {isProcessing && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                      {React.createElement(getCurrentStage().icon, {
                        className: "h-6 w-6 text-white animate-pulse"
                      })}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI Processing in Progress</h3>
                      <p className="text-slate-300">{getCurrentStage().label}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {processingStages.map((stage, index) => (
                      <div
                        key={stage.stage}
                        className={`p-3 rounded-lg border transition-all duration-500 ${
                          processingStage === stage.stage
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : processingStages.findIndex(s => s.stage === processingStage) > index
                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                            : 'bg-slate-700/50 border-slate-600/50 text-slate-400'
                        }`}
                      >
                        <stage.icon className="h-5 w-5 mb-2" />
                        <p className="text-xs font-medium">{stage.label.split('...')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <div>
                      <h3 className="text-red-300 font-semibold">Processing Error</h3>
                      <p className="text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {!isUploading && !isProcessing && !error && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Upload className="h-5 w-5" />
                  <span>Start AI Analysis</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* AI Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Advanced AI Processing Pipeline
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Scan,
                title: 'OCR Extraction',
                description: 'Advanced text recognition from medical documents',
                color: 'from-cyan-400 to-blue-500'
              },
              {
                icon: Brain,
                title: 'NLP Analysis',
                description: 'Natural language processing for medical context',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: Activity,
                title: 'Disease Prediction',
                description: 'ML models predict potential health risks',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: Zap,
                title: 'Smart Recommendations',
                description: 'Personalized health insights and suggestions',
                color: 'from-orange-400 to-red-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50 group-hover:border-cyan-500/30 transition-all duration-300">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard