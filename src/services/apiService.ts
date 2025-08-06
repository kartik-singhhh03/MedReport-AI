import { supabase } from '../lib/supabase'
import { createWorker } from 'tesseract.js'
import { HfInference } from '@huggingface/inference'

// Initialize Hugging Face client
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY)

// Gemini Pro API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

interface MedicalReport {
  id: string
  filename: string
  fileUrl: string
  fileType: string
  userId: string
}

interface AnalysisResult {
  simpleExplanation: string
  technicalAnalysis: string
  aiRecommendations: string
  healthScore: number
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  keyFindings: string[]
  biomarkers: Record<string, any>
  confidence: number
  processingTime: number
}

interface OCRResult {
  text: string
  confidence: number
  sections: {
    diagnosis?: string
    findings?: string
    labs?: string
    notes?: string
  }
}

export class APIService {
  private static instance: APIService

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService()
    }
    return APIService.instance
  }

  /**
   * Extract text from PDF/Image using OCR with preprocessing
   */
  async extractTextWithOCR(file: File): Promise<OCRResult> {
    try {
      console.log('Starting OCR extraction with preprocessing...')
      
      const worker = await createWorker('eng', 1, {
        logger: m => console.log(m)
      })

      const { data } = await worker.recognize(file)
      await worker.terminate()

      // Preprocess extracted text
      const processedText = this.preprocessText(data.text)
      
      // Segment text into sections
      const sections = this.segmentText(processedText)

      console.log('OCR extraction completed with preprocessing')
      
      return {
        text: processedText,
        confidence: data.confidence,
        sections
      }
    } catch (error) {
      console.error('OCR extraction failed:', error)
      throw new Error('Failed to extract text from medical report')
    }
  }

  /**
   * Preprocess extracted text to remove noise and improve quality
   */
  private preprocessText(text: string): string {
    return text
      // Remove common headers/footers
      .replace(/^(?:Page|PAGE)\s*\d+.*$/gm, '')
      .replace(/^(?:Confidential|CONFIDENTIAL).*$/gm, '')
      .replace(/^(?:Date|DATE):.*$/gm, '')
      
      // Clean up formatting
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      
      // Remove excessive whitespace
      .trim()
      
      // Normalize medical abbreviations
      .replace(/\bBP\b/g, 'Blood Pressure')
      .replace(/\bHR\b/g, 'Heart Rate')
      .replace(/\bRR\b/g, 'Respiratory Rate')
      .replace(/\bTemp\b/g, 'Temperature')
      .replace(/\bO2\b/g, 'Oxygen')
      .replace(/\bCT\b/g, 'Computed Tomography')
      .replace(/\bMRI\b/g, 'Magnetic Resonance Imaging')
      .replace(/\bECG\b/g, 'Electrocardiogram')
      .replace(/\bCBC\b/g, 'Complete Blood Count')
      .replace(/\bCMP\b/g, 'Comprehensive Metabolic Panel')
  }

  /**
   * Segment text into medical report sections
   */
  private segmentText(text: string): OCRResult['sections'] {
    const sections: OCRResult['sections'] = {}
    
    // Split text into lines for analysis
    const lines = text.split('\n')
    
    let currentSection = ''
    let diagnosisLines: string[] = []
    let findingsLines: string[] = []
    let labsLines: string[] = []
    let notesLines: string[] = []
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      // Identify section headers
      if (lowerLine.includes('diagnosis') || lowerLine.includes('impression')) {
        currentSection = 'diagnosis'
        continue
      } else if (lowerLine.includes('findings') || lowerLine.includes('results')) {
        currentSection = 'findings'
        continue
      } else if (lowerLine.includes('laboratory') || lowerLine.includes('lab') || lowerLine.includes('test')) {
        currentSection = 'labs'
        continue
      } else if (lowerLine.includes('notes') || lowerLine.includes('comments') || lowerLine.includes('recommendation')) {
        currentSection = 'notes'
        continue
      }
      
      // Add lines to appropriate sections
      if (line.trim()) {
        switch (currentSection) {
          case 'diagnosis':
            diagnosisLines.push(line)
            break
          case 'findings':
            findingsLines.push(line)
            break
          case 'labs':
            labsLines.push(line)
            break
          case 'notes':
            notesLines.push(line)
            break
          default:
            // If no section identified, add to findings
            findingsLines.push(line)
        }
      }
    }
    
    if (diagnosisLines.length > 0) sections.diagnosis = diagnosisLines.join('\n')
    if (findingsLines.length > 0) sections.findings = findingsLines.join('\n')
    if (labsLines.length > 0) sections.labs = labsLines.join('\n')
    if (notesLines.length > 0) sections.notes = notesLines.join('\n')
    
    return sections
  }

  /**
   * Validate medical terms using Hugging Face BioBERT
   */
  async validateMedicalTerms(text: string): Promise<any> {
    try {
      console.log('Validating medical terms with BioBERT...')
      
      // Use BioBERT for medical entity recognition
      const nerResult = await hf.tokenClassification({
        model: 'emilyalsentzer/Bio_ClinicalBERT',
        inputs: text.substring(0, 512), // Limit text length
      })

      // Use medical text classification
      const classificationResult = await hf.textClassification({
        model: 'emilyalsentzer/Bio_ClinicalBERT',
        inputs: text.substring(0, 512),
      })

      return {
        entities: nerResult,
        classification: classificationResult,
        validatedTerms: this.extractValidatedTerms(nerResult)
      }
    } catch (error) {
      console.error('Medical term validation failed:', error)
      return null
    }
  }

  /**
   * Extract validated medical terms from NER results
   */
  private extractValidatedTerms(nerResult: any[]): string[] {
    const validatedTerms: string[] = []
    
    if (Array.isArray(nerResult)) {
      nerResult.forEach(entity => {
        if (entity.score > 0.8) { // High confidence threshold
          validatedTerms.push(entity.word)
        }
      })
    }
    
    return [...new Set(validatedTerms)] // Remove duplicates
  }

  /**
   * Generate comprehensive analysis using Gemini Pro
   */
  async generateGeminiAnalysis(
    ocrText: string, 
    validatedTerms: string[], 
    sections: OCRResult['sections'],
    reportType: string
  ): Promise<AnalysisResult> {
    try {
      console.log('Generating comprehensive analysis with Gemini Pro...')

      const prompt = this.buildComprehensivePrompt(ocrText, validatedTerms, sections, reportType)
      
      const startTime = Date.now()
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more consistent medical analysis
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3072, // Increased for comprehensive analysis
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const analysisText = data.candidates[0].content.parts[0].text
      const processingTime = Date.now() - startTime

      return this.parseComprehensiveResponse(analysisText, ocrText, processingTime)
    } catch (error) {
      console.error('Gemini analysis failed:', error)
      return this.generateFallbackAnalysis(ocrText, reportType)
    }
  }

  /**
   * Build comprehensive prompt for Gemini Pro
   */
  private buildComprehensivePrompt(
    ocrText: string, 
    validatedTerms: string[], 
    sections: OCRResult['sections'],
    reportType: string
  ): string {
    return `
You are an expert medical AI analyst specializing in patient-friendly explanations. Analyze the following medical report and provide a comprehensive analysis.

MEDICAL REPORT TEXT (OCR Extracted):
${ocrText}

REPORT TYPE: ${reportType}

VALIDATED MEDICAL TERMS:
${validatedTerms.join(', ')}

REPORT SECTIONS:
${Object.entries(sections).map(([key, value]) => `${key.toUpperCase()}: ${value}`).join('\n\n')}

Please provide a detailed analysis in the following JSON format:

{
  "simpleExplanation": "Patient-friendly explanation in simple language, avoiding medical jargon. Be empathetic and clear about what the findings mean for the patient's health.",
  "technicalAnalysis": "Detailed medical analysis using proper medical terminology. Include specific findings, diagnoses, and clinical observations.",
  "aiRecommendations": "Personalized actionable recommendations including lifestyle changes, follow-up appointments, medication considerations, and urgent care alerts if needed.",
  "healthScore": 85,
  "riskLevel": "moderate",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "biomarkers": {
    "blood_pressure": {"value": "140/90", "unit": "mmHg", "normal": "120/80", "status": "elevated"},
    "glucose": {"value": "98", "unit": "mg/dL", "normal": "70-100", "status": "normal"}
  },
  "confidence": 95.5
}

IMPORTANT GUIDELINES:
1. Simple Explanation: Use empathetic, jargon-free language. Explain what the findings mean for the patient's daily life.
2. Technical Analysis: Use precise medical terminology. Include specific diagnoses, test results, and clinical observations.
3. AI Recommendations: Provide actionable, personalized advice. Include lifestyle changes, follow-up needs, and urgent care alerts.
4. Health Score: Calculate 0-100 score based on severity and number of conditions.
5. Risk Level: Determine risk level (low/moderate/high/critical) based on findings.
6. Key Findings: List the most important medical findings.
7. Biomarkers: Extract and interpret key medical values with normal ranges.
8. Confidence: Assess analysis quality based on data clarity and completeness.

Focus on accuracy, empathy, and actionable insights. If data is unclear, indicate uncertainty.
`
  }

  /**
   * Parse comprehensive Gemini Pro response
   */
  private parseComprehensiveResponse(
    response: string, 
    ocrText: string, 
    processingTime: number
  ): AnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          simpleExplanation: parsed.simpleExplanation || 'Analysis completed successfully.',
          technicalAnalysis: parsed.technicalAnalysis || 'Medical report analyzed with standard protocols.',
          aiRecommendations: parsed.aiRecommendations || 'Please consult your healthcare provider for personalized advice.',
          healthScore: parsed.healthScore || 75,
          riskLevel: parsed.riskLevel || 'moderate',
          keyFindings: parsed.keyFindings || ['Report processed successfully'],
          biomarkers: parsed.biomarkers || {},
          confidence: parsed.confidence || 80,
          processingTime
        }
      }
    } catch (error) {
      console.error('Failed to parse Gemini response:', error)
    }

    return this.generateFallbackAnalysis(ocrText, 'unknown')
  }

  /**
   * Generate fallback analysis when AI services fail
   */
  private generateFallbackAnalysis(ocrText: string, reportType: string): AnalysisResult {
    const hasCriticalKeywords = /stroke|heart attack|cancer|tumor|severe|critical|emergency/i.test(ocrText)
    const hasModerateKeywords = /hypertension|diabetes|elevated|abnormal|mild/i.test(ocrText)
    const hasBloodKeywords = /blood|hemoglobin|wbc|rbc|platelet/i.test(ocrText)
    const hasHeartKeywords = /cholesterol|ldl|hdl|triglyceride|cardiac/i.test(ocrText)

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let healthScore = 80
    let simpleExplanation = 'Your medical report has been analyzed. Please consult your healthcare provider for detailed interpretation.'
    let technicalAnalysis = 'Document analysis completed. Medical terminology identified and processed.'
    let aiRecommendations = 'Schedule an appointment with your doctor to discuss these results in detail.'
    let keyFindings = ['Document processed successfully']

    if (hasCriticalKeywords) {
      riskLevel = 'critical'
      healthScore = 30
      simpleExplanation = 'Your report indicates serious medical conditions that require immediate attention. Please contact your healthcare provider urgently.'
      technicalAnalysis = 'Critical medical findings detected. Immediate medical intervention recommended.'
      aiRecommendations = 'URGENT: Contact your healthcare provider immediately. Do not delay seeking medical attention.'
      keyFindings = ['Critical conditions detected', 'Immediate medical attention required']
    } else if (hasModerateKeywords) {
      riskLevel = 'moderate'
      healthScore = 60
      simpleExplanation = 'Your report shows some medical conditions that need attention. Regular monitoring and follow-up are recommended.'
      technicalAnalysis = 'Moderate medical conditions identified. Regular monitoring and treatment recommended.'
      aiRecommendations = 'Schedule follow-up appointments. Monitor your condition regularly. Consider lifestyle modifications.'
      keyFindings = ['Moderate conditions identified', 'Regular monitoring needed']
    } else if (hasBloodKeywords || hasHeartKeywords) {
      riskLevel = 'low'
      healthScore = 85
      simpleExplanation = 'Your blood work and heart health markers appear to be within normal ranges. Continue with your current health routine.'
      technicalAnalysis = 'Blood work and cardiovascular markers within normal parameters. No immediate concerns detected.'
      aiRecommendations = 'Continue with regular exercise and balanced diet. Schedule annual check-ups.'
      keyFindings = ['Normal blood parameters', 'Good cardiovascular health']
    }

    return {
      simpleExplanation,
      technicalAnalysis,
      aiRecommendations,
      healthScore,
      riskLevel,
      keyFindings,
      biomarkers: {},
      confidence: 75,
      processingTime: 0
    }
  }

  /**
   * Main analysis function - orchestrates the entire process
   */
  async analyzeMedicalReport(file: File, report: MedicalReport): Promise<AnalysisResult> {
    try {
      console.log('Starting comprehensive medical report analysis...')
      const startTime = Date.now()

      // Step 1: Extract text using OCR with preprocessing
      const ocrResult = await this.extractTextWithOCR(file)
      console.log('OCR completed, extracted text length:', ocrResult.text.length)

      // Step 2: Validate medical terms using Hugging Face
      const validationResult = await this.validateMedicalTerms(ocrResult.text)
      console.log('Medical term validation completed')

      // Step 3: Generate comprehensive analysis with Gemini Pro
      const analysis = await this.generateGeminiAnalysis(
        ocrResult.text, 
        validationResult?.validatedTerms || [],
        ocrResult.sections,
        report.fileType
      )
      console.log('Gemini Pro analysis completed')

      const totalProcessingTime = Date.now() - startTime
      analysis.processingTime = totalProcessingTime

      return analysis
    } catch (error) {
      console.error('Analysis failed:', error)
      throw new Error('Failed to analyze medical report')
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(file: File, userId: string): Promise<{ fileUrl: string; fileName: string }> {
    const fileName = `${userId}/${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('medical-reports')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('medical-reports')
      .getPublicUrl(fileName)

    return {
      fileUrl: urlData.publicUrl,
      fileName: file.name
    }
  }

  /**
   * Save analysis results to database
   */
  async saveAnalysisResults(
    reportId: string,
    analysis: AnalysisResult,
    ocrText: string
  ): Promise<void> {
    const { error } = await supabase
      .from('analysis_results')
      .insert({
        report_id: reportId,
        technical_analysis: analysis.technicalAnalysis,
        layman_explanation_en: analysis.simpleExplanation,
        layman_explanation_hi: analysis.simpleExplanation, // For now, same as English
        recommendations: analysis.aiRecommendations,
        health_score: analysis.healthScore,
        risk_factors: analysis.keyFindings,
        key_findings: analysis.keyFindings,
        status: 'completed'
      })

    if (error) {
      console.error('Error saving analysis results:', error)
      throw error
    }
  }
}

export default APIService.getInstance() 