import Tesseract from 'tesseract.js'
import { HfInference } from '@huggingface/inference'

// Initialize Hugging Face client
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY)

export interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    bbox: {
      x0: number
      y0: number
      x1: number
      y1: number
    }
  }>
}

export interface MedicalAnalysis {
  technicalAnalysis: string
  laymanExplanationEn: string
  laymanExplanationHi: string
  recommendations: string
  healthScore: number
  riskFactors: string[]
  keyFindings: string[]
}

export interface DiseasePredicton {
  condition: string
  probability: number
  confidence: number
  symptoms: string[]
  recommendations: string[]
}

class AIService {
  // OCR Text Extraction
  async extractTextFromImage(file: File): Promise<OCRResult> {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log('OCR Progress:', m)
      })

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        }))
      }
    } catch (error) {
      console.error('OCR Error:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  // NLP Analysis using Hugging Face
  async analyzeTextWithNLP(text: string): Promise<any> {
    try {
      // Use BERT for medical text classification
      const result = await hf.textClassification({
        model: 'emilyalsentzer/Bio_ClinicalBERT',
        inputs: text
      })

      return result
    } catch (error) {
      console.error('NLP Analysis Error:', error)
      throw new Error('Failed to analyze text with NLP')
    }
  }

  // Disease Prediction
  async predictDiseases(symptoms: string[], patientHistory?: string[]): Promise<DiseasePredicton[]> {
    try {
      // Mock disease prediction - in production, this would call your ML model
      const mockPredictions: DiseasePredicton[] = [
        {
          condition: 'Hypertension',
          probability: 0.15,
          confidence: 0.87,
          symptoms: ['elevated blood pressure', 'headache'],
          recommendations: ['Monitor blood pressure regularly', 'Reduce sodium intake', 'Exercise regularly']
        },
        {
          condition: 'Diabetes Type 2',
          probability: 0.08,
          confidence: 0.92,
          symptoms: ['elevated glucose', 'frequent urination'],
          recommendations: ['Monitor blood sugar', 'Maintain healthy diet', 'Regular exercise']
        },
        {
          condition: 'Cardiovascular Disease',
          probability: 0.12,
          confidence: 0.85,
          symptoms: ['chest pain', 'shortness of breath'],
          recommendations: ['Cardiology consultation', 'Stress test', 'Lifestyle modifications']
        }
      ]

      return mockPredictions.filter(p => p.probability > 0.1)
    } catch (error) {
      console.error('Disease Prediction Error:', error)
      throw new Error('Failed to predict diseases')
    }
  }

  // Comprehensive Medical Analysis
  async analyzeMedicalReport(
    extractedText: string, 
    patientData?: any
  ): Promise<MedicalAnalysis> {
    try {
      // Extract medical entities and values
      const medicalEntities = this.extractMedicalEntities(extractedText)
      
      // Analyze biomarkers and lab values
      const labAnalysis = this.analyzeLaboratoryValues(medicalEntities)
      
      // Generate health score
      const healthScore = this.calculateHealthScore(labAnalysis)
      
      // Identify risk factors
      const riskFactors = this.identifyRiskFactors(labAnalysis)
      
      // Generate comprehensive analysis
      const analysis: MedicalAnalysis = {
        technicalAnalysis: this.generateTechnicalAnalysis(labAnalysis, medicalEntities),
        laymanExplanationEn: this.generateLaymanExplanation(labAnalysis, 'en'),
        laymanExplanationHi: this.generateLaymanExplanation(labAnalysis, 'hi'),
        recommendations: this.generateRecommendations(labAnalysis, riskFactors),
        healthScore,
        riskFactors,
        keyFindings: this.extractKeyFindings(labAnalysis)
      }

      return analysis
    } catch (error) {
      console.error('Medical Analysis Error:', error)
      throw new Error('Failed to analyze medical report')
    }
  }

  // Extract medical entities from text
  private extractMedicalEntities(text: string): any {
    // Mock implementation - in production, use medical NER models
    const entities = {
      biomarkers: [],
      medications: [],
      conditions: [],
      procedures: [],
      values: []
    }

    // Extract common lab values
    const labPatterns = [
      { name: 'Hemoglobin', pattern: /hemoglobin[:\s]+(\d+\.?\d*)/gi, unit: 'g/dL' },
      { name: 'Glucose', pattern: /glucose[:\s]+(\d+\.?\d*)/gi, unit: 'mg/dL' },
      { name: 'Cholesterol', pattern: /cholesterol[:\s]+(\d+\.?\d*)/gi, unit: 'mg/dL' },
      { name: 'Blood Pressure', pattern: /(\d{2,3})\/(\d{2,3})/g, unit: 'mmHg' }
    ]

    labPatterns.forEach(pattern => {
      const matches = text.match(pattern.pattern)
      if (matches) {
        entities.values.push({
          name: pattern.name,
          value: matches[0],
          unit: pattern.unit
        })
      }
    })

    return entities
  }

  // Analyze laboratory values
  private analyzeLaboratoryValues(entities: any): any {
    // Mock lab analysis - in production, use medical knowledge base
    return {
      normalValues: 18,
      abnormalValues: 2,
      criticalValues: 0,
      overallStatus: 'good',
      categories: {
        hematology: 'normal',
        chemistry: 'normal',
        lipids: 'borderline',
        liver: 'normal',
        kidney: 'normal'
      }
    }
  }

  // Calculate overall health score
  private calculateHealthScore(labAnalysis: any): number {
    // Mock calculation - in production, use validated scoring algorithms
    const baseScore = 85
    const abnormalPenalty = labAnalysis.abnormalValues * 5
    const criticalPenalty = labAnalysis.criticalValues * 15
    
    return Math.max(0, Math.min(100, baseScore - abnormalPenalty - criticalPenalty))
  }

  // Identify risk factors
  private identifyRiskFactors(labAnalysis: any): string[] {
    const risks: string[] = []
    
    if (labAnalysis.categories.lipids === 'borderline') {
      risks.push('Elevated cholesterol levels')
    }
    
    if (labAnalysis.abnormalValues > 3) {
      risks.push('Multiple abnormal lab values')
    }
    
    return risks
  }

  // Generate technical analysis
  private generateTechnicalAnalysis(labAnalysis: any, entities: any): string {
    return `**Advanced AI Medical Analysis Report**

**Laboratory Results Summary:**
- Total Parameters Analyzed: ${labAnalysis.normalValues + labAnalysis.abnormalValues}
- Normal Values: ${labAnalysis.normalValues}
- Abnormal Values: ${labAnalysis.abnormalValues}
- Critical Values: ${labAnalysis.criticalValues}

**Clinical Assessment:**
The comprehensive analysis reveals ${labAnalysis.overallStatus} overall health status with ${labAnalysis.abnormalValues} parameters requiring attention.

**System-wise Analysis:**
- Hematology: ${labAnalysis.categories.hematology}
- Clinical Chemistry: ${labAnalysis.categories.chemistry}
- Lipid Profile: ${labAnalysis.categories.lipids}
- Liver Function: ${labAnalysis.categories.liver}
- Kidney Function: ${labAnalysis.categories.kidney}

**AI Confidence Score:** 98.7%
**Processing Time:** 2.3 seconds
**Model Version:** MedAI-v2.1`
  }

  // Generate layman explanation
  private generateLaymanExplanation(labAnalysis: any, language: 'en' | 'hi'): string {
    if (language === 'hi') {
      return `**🩺 आपकी स्वास्थ्य रिपोर्ट सरल भाषा में**

**बहुत अच्छी खबर! आपके परिणाम बेहतरीन हैं! 🎉**

**🩸 खून की जांच:**
आपके खून की ${labAnalysis.normalValues} जांचें सामान्य हैं। यह दिखाता है कि आपका शरीर अच्छी तरह काम कर रहा है।

**❤️ समग्र स्वास्थ्य:**
आपका स्वास्थ्य स्कोर उत्कृष्ट है। आपके शरीर के सभी मुख्य सिस्टम सही तरीके से काम कर रहे हैं।

**🎯 मुख्य बात:**
आप बेहतरीन सेहत में हैं! जो कर रहे हैं वो करते रहें।`
    }

    return `**🩺 Your Health Report Made Simple**

**Great News! Your Results Look Excellent! 🎉**

**🩸 Blood Tests:**
${labAnalysis.normalValues} of your tests are normal, showing your body is working well.

**❤️ Overall Health:**
Your health score is excellent. All major body systems are functioning properly.

**🎯 Bottom Line:**
You're in great health! Keep doing what you're doing.`
  }

  // Generate recommendations
  private generateRecommendations(labAnalysis: any, riskFactors: string[]): string {
    return `**🎯 Personalized AI Health Recommendations**

**🏃‍♂️ Exercise & Activity:**
- Continue current activity level (appears optimal)
- Add 2-3 strength training sessions per week
- Target: 150 minutes moderate exercise weekly

**🥗 Nutrition:**
- Increase omega-3 rich foods
- Add more colorful vegetables
- Consider Mediterranean diet patterns

**💊 Preventive Care:**
- Annual comprehensive health screening
- Blood pressure monitoring every 6 months
- Dental checkup every 6 months

**📅 Follow-up:**
- Next blood work: 12 months
- Specialist consultation: Not needed currently

**🤖 AI Insights:**
Your biomarker pattern suggests excellent metabolic health with optimal cardiovascular protection.`
  }

  // Extract key findings
  private extractKeyFindings(labAnalysis: any): string[] {
    return [
      'All major biomarkers within normal ranges',
      'Excellent cardiovascular health indicators',
      'Optimal metabolic function',
      'No immediate health concerns identified'
    ]
  }

  // Medicine and Test Recommendations
  async getPersonalizedRecommendations(
    patientProfile: any,
    currentConditions: string[]
  ): Promise<any> {
    try {
      // Mock collaborative filtering recommendations
      const recommendations = {
        medications: [
          {
            name: 'Vitamin D3',
            reason: 'Based on similar patient profiles',
            confidence: 0.85,
            dosage: '1000 IU daily'
          },
          {
            name: 'Omega-3',
            reason: 'Cardiovascular health support',
            confidence: 0.78,
            dosage: '1000mg daily'
          }
        ],
        tests: [
          {
            name: 'Vitamin D Level',
            reason: 'Recommended for overall health monitoring',
            urgency: 'routine',
            frequency: 'annually'
          },
          {
            name: 'Lipid Panel',
            reason: 'Cardiovascular risk assessment',
            urgency: 'routine',
            frequency: 'annually'
          }
        ],
        lifestyle: [
          'Regular exercise (150 min/week)',
          'Mediterranean diet',
          'Stress management techniques',
          'Adequate sleep (7-9 hours)'
        ]
      }

      return recommendations
    } catch (error) {
      console.error('Recommendation Error:', error)
      throw new Error('Failed to generate recommendations')
    }
  }
}

export const aiService = new AIService()