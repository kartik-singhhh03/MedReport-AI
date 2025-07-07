import { z } from 'zod'

// File validation schemas
export const fileValidationSchema = z.object({
  name: z.string().min(1, 'Filename is required'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'], {
    errorMap: () => ({ message: 'Only PDF, JPEG, and PNG files are allowed' })
  })
})

// Report validation schemas
export const reportSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  file_url: z.string().url('Invalid file URL'),
  file_type: z.string().min(1, 'File type is required'),
  status: z.enum(['processing', 'completed', 'failed'])
})

// User preferences validation
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['en', 'hi']).default('en'),
  accessibility_mode: z.boolean().default(false)
})

// Validation helper functions
export function validateFile(file: File): { isValid: boolean; errors: string[] } {
  try {
    fileValidationSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    })
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        errors: error.errors.map(e => e.message) 
      }
    }
    return { isValid: false, errors: ['Unknown validation error'] }
  }
}

export function sanitizeFilename(filename: string): string {
  // Remove potentially dangerous characters
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 255)
}

export function validateMedicalText(text: string): boolean {
  // Basic validation for medical text content
  const medicalKeywords = [
    'blood', 'test', 'result', 'lab', 'report', 'analysis',
    'glucose', 'cholesterol', 'hemoglobin', 'pressure', 'heart',
    'liver', 'kidney', 'urine', 'x-ray', 'scan', 'mri', 'ct'
  ]
  
  const lowerText = text.toLowerCase()
  return medicalKeywords.some(keyword => lowerText.includes(keyword))
}