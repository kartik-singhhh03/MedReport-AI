import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  reportId: string
  userId: string
  language?: 'en' | 'hi'
}

interface AnalysisResult {
  id: string
  reportId: string
  technicalAnalysis: string
  laymanExplanationEn: string
  laymanExplanationHi: string
  recommendations: string
  healthScore: number
  riskFactors: string[]
  keyFindings: string[]
  status: 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { reportId, userId, language = 'en' }: AnalysisRequest = await req.json()

    if (!reportId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the report from database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', userId)
      .single()

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update report status to processing
    await supabase
      .from('reports')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', reportId)

    // Simulate AI analysis (replace with actual AI service calls)
    const analysisResult = await performAIAnalysis(report, language)

    // Save analysis result
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analysis_results')
      .insert({
        report_id: reportId,
        technical_analysis: analysisResult.technicalAnalysis,
        layman_explanation_en: analysisResult.laymanExplanationEn,
        layman_explanation_hi: analysisResult.laymanExplanationHi,
        recommendations: analysisResult.recommendations,
        health_score: analysisResult.healthScore,
        risk_factors: analysisResult.riskFactors,
        key_findings: analysisResult.keyFindings,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving analysis result:', saveError)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis result' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update report status to completed
    await supabase
      .from('reports')
      .update({ 
        status: 'completed', 
        analysis_id: savedAnalysis.id,
        updated_at: new Date().toISOString() 
      })
      .eq('id', reportId)

    return new Response(
      JSON.stringify({
        success: true,
        analysis: savedAnalysis
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-report function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function performAIAnalysis(report: any, language: string): Promise<AnalysisResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock AI analysis based on report type
  const reportType = report.file_type || 'unknown'
  const fileName = report.filename || ''

  let technicalAnalysis = ''
  let laymanExplanationEn = ''
  let laymanExplanationHi = ''
  let recommendations = ''
  let healthScore = 75
  let riskFactors: string[] = []
  let keyFindings: string[] = []

  // Simulate different analysis based on file type
  if (reportType.includes('blood') || fileName.toLowerCase().includes('blood')) {
    technicalAnalysis = 'Blood test analysis indicates normal ranges for most parameters. Hemoglobin levels are within normal limits. Lipid profile shows acceptable cholesterol levels.'
    laymanExplanationEn = 'Your blood test results look good overall. Your red blood cells and cholesterol levels are normal, which is great for your health.'
    laymanExplanationHi = 'आपके रक्त परीक्षण के परिणाम कुल मिलाकर अच्छे हैं। आपके लाल रक्त कोशिकाओं और कोलेस्ट्रॉल के स्तर सामान्य हैं, जो आपके स्वास्थ्य के लिए अच्छा है।'
    recommendations = 'Continue with regular exercise and balanced diet. Schedule follow-up in 6 months.'
    healthScore = 85
    riskFactors = ['Slightly elevated LDL cholesterol']
    keyFindings = ['Normal hemoglobin levels', 'Acceptable lipid profile', 'Good kidney function']
  } else if (reportType.includes('x-ray') || fileName.toLowerCase().includes('xray')) {
    technicalAnalysis = 'Chest X-ray shows clear lung fields with no evidence of infiltrates or masses. Cardiac silhouette is normal. No pleural effusion detected.'
    laymanExplanationEn = 'Your chest X-ray looks normal. Your lungs appear healthy with no signs of infection or other problems.'
    laymanExplanationHi = 'आपकी छाती का एक्स-रे सामान्य दिखता है। आपके फेफड़े स्वस्थ दिखते हैं और संक्रमण या अन्य समस्याओं के कोई संकेत नहीं हैं।'
    recommendations = 'Continue with current treatment plan. Follow up as scheduled.'
    healthScore = 90
    riskFactors = []
    keyFindings = ['Clear lung fields', 'Normal cardiac silhouette', 'No pleural effusion']
  } else if (reportType.includes('mri') || fileName.toLowerCase().includes('mri')) {
    technicalAnalysis = 'MRI scan reveals normal brain parenchyma with no evidence of mass lesions or significant abnormalities. Ventricular system appears normal.'
    laymanExplanationEn = 'Your brain MRI looks normal. No tumors or other concerning findings were detected.'
    laymanExplanationHi = 'आपका मस्तिष्क MRI सामान्य दिखता है। कोई ट्यूमर या अन्य चिंताजनक निष्कर्ष नहीं मिले।'
    recommendations = 'Continue with current medications if prescribed. Follow up in 1 year.'
    healthScore = 95
    riskFactors = []
    keyFindings = ['Normal brain parenchyma', 'No mass lesions', 'Normal ventricular system']
  } else {
    // Generic analysis for unknown file types
    technicalAnalysis = 'Document analysis completed. Medical terminology identified and processed. No critical abnormalities detected in the provided medical report.'
    laymanExplanationEn = 'Your medical report has been analyzed. The results appear to be within normal ranges, but please consult with your healthcare provider for detailed interpretation.'
    laymanExplanationHi = 'आपकी चिकित्सा रिपोर्ट का विश्लेषण किया गया है। परिणाम सामान्य सीमा के भीतर दिखते हैं, लेकिन विस्तृत व्याख्या के लिए कृपया अपने स्वास्थ्य सेवा प्रदाता से परामर्श करें।'
    recommendations = 'Schedule an appointment with your doctor to discuss these results in detail.'
    healthScore = 70
    riskFactors = ['Requires professional interpretation']
    keyFindings = ['Document processed successfully', 'Medical terminology identified']
  }

  return {
    id: crypto.randomUUID(),
    reportId: report.id,
    technicalAnalysis,
    laymanExplanationEn,
    laymanExplanationHi,
    recommendations,
    healthScore,
    riskFactors,
    keyFindings,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}