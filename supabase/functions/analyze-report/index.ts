import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { reportId } = await req.json()

    if (!reportId) {
      throw new Error('Report ID is required')
    }

    // Get the report from the database
    const { data: report, error: fetchError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Get the file content from storage
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('medical-reports')
      .download(report.file_url)

    if (fileError) {
      throw fileError
    }

    // Convert file to base64 for OpenAI (for images) or extract text (for PDFs)
    let fileContent = ''
    let analysisPrompt = ''

    if (report.file_type === 'application/pdf') {
      // For PDFs, we'll use a simplified approach
      // In production, you'd want to use a PDF parsing library
      analysisPrompt = `
        Analyze this medical report PDF. The filename is: ${report.filename}
        
        Please provide a comprehensive analysis including:
        1. Technical medical analysis
        2. Simple explanation in English
        3. Simple explanation in Hindi
        4. Personalized recommendations
        
        Format your response as JSON with these exact keys:
        {
          "technical_analysis": "detailed technical analysis here",
          "layman_explanation_en": "simple English explanation here",
          "layman_explanation_hi": "simple Hindi explanation here",
          "recommendations": "personalized recommendations here"
        }
      `
    } else {
      // For images, convert to base64
      const arrayBuffer = await fileData.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      analysisPrompt = `
        Analyze this medical report image. The filename is: ${report.filename}
        
        Please extract all visible text and medical information, then provide:
        1. Technical medical analysis of all findings
        2. Simple explanation in English for a layperson
        3. Simple explanation in Hindi (हिंदी) for a layperson
        4. Personalized health recommendations
        
        Format your response as JSON with these exact keys:
        {
          "technical_analysis": "detailed technical analysis here",
          "layman_explanation_en": "simple English explanation here",
          "layman_explanation_hi": "simple Hindi explanation here",
          "recommendations": "personalized recommendations here"
        }
      `
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4 Omni for better medical analysis
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant specialized in analyzing medical reports and lab results. You provide accurate, helpful analysis while emphasizing that this is for educational purposes only and users should consult healthcare professionals for medical advice.

            Guidelines:
            - Provide detailed technical analysis using proper medical terminology
            - Create simple explanations that anyone can understand
            - Use emojis and simple language in layman explanations
            - Provide actionable, safe health recommendations
            - Always include medical disclaimers
            - For Hindi explanations, use clear Devanagari script
            - Focus on key findings, normal/abnormal values, and health implications
            - Be encouraging but honest about any concerning findings`
          },
          {
            role: 'user',
            content: report.file_type.includes('image') ? [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${report.file_type};base64,${base64}`
                }
              }
            ] : analysisPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.3, // Lower temperature for more consistent medical analysis
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData}`)
    }

    const aiResult: OpenAIResponse = await openaiResponse.json()
    const analysisContent = aiResult.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('No analysis content received from OpenAI')
    }

    // Parse the JSON response from OpenAI
    let analysisResult
    try {
      analysisResult = JSON.parse(analysisContent)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      analysisResult = {
        technical_analysis: analysisContent,
        layman_explanation_en: "Analysis completed. Please review the technical analysis for detailed information.",
        layman_explanation_hi: "विश्लेषण पूरा हुआ। विस्तृत जानकारी के लिए तकनीकी विश्लेषण देखें।",
        recommendations: "Please consult with your healthcare provider to discuss these results and next steps."
      }
    }

    // Add medical disclaimers to each section
    const disclaimerEn = "\n\n⚠️ **Medical Disclaimer**: This analysis is for educational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment decisions."
    const disclaimerHi = "\n\n⚠️ **चिकित्सा अस्वीकरण**: यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। चिकित्सा सलाह, निदान और उपचार के निर्णयों के लिए हमेशा योग्य स्वास्थ्य पेशेवरों से सलाह लें।"

    analysisResult.technical_analysis += disclaimerEn
    analysisResult.layman_explanation_en += disclaimerEn
    analysisResult.layman_explanation_hi += disclaimerHi
    analysisResult.recommendations += disclaimerEn

    // Update the report with analysis results
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({
        technical_analysis: analysisResult.technical_analysis,
        layman_explanation_en: analysisResult.layman_explanation_en,
        layman_explanation_hi: analysisResult.layman_explanation_hi,
        recommendations: analysisResult.recommendations,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)

    if (updateError) {
      throw updateError
    }

    // Log analytics event
    await supabaseClient
      .from('analytics')
      .insert({
        user_id: report.user_id,
        event_type: 'report_analyzed',
        event_data: {
          report_id: reportId,
          file_type: report.file_type,
          analysis_model: 'gpt-4o',
          processing_time: Date.now()
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Report analyzed successfully',
        analysis: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    
    // Update report status to failed
    if (reportId) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabaseClient
          .from('reports')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId)
      } catch (updateError) {
        console.error('Failed to update report status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Analysis failed',
        details: error.toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})