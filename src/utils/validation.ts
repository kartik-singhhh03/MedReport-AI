import { z } from 'zod'

// File validation schemas
export const fileValidationSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'])
})

export const imageValidationSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
})

// Form validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional()
})

// Medical data validation schemas
export const medicalReportSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const analysisResultSchema = z.object({
  reportId: z.string().uuid(),
  technicalAnalysis: z.string().min(1, 'Technical analysis is required'),
  laymanExplanationEn: z.string().min(1, 'English explanation is required'),
  laymanExplanationHi: z.string().min(1, 'Hindi explanation is required'),
  recommendations: z.string().min(1, 'Recommendations are required'),
  healthScore: z.number().min(0).max(100),
  riskFactors: z.array(z.string()).optional(),
  keyFindings: z.array(z.string()).optional()
})

// Validation functions
export const validateFile = (file: File, options?: {
  maxSize?: number
  allowedTypes?: string[]
}): { isValid: boolean; error?: string } => {
  const maxSize = options?.maxSize || 10 * 1024 * 1024 // 10MB
  const allowedTypes = options?.allowedTypes || ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { isValid: true }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateDateOfBirth = (date: string): boolean => {
  const birthDate = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  return age >= 0 && age <= 120
}

// Data sanitization functions
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '') // Remove non-digits
}

export const sanitizeFileName = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid characters with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
}

// Medical data validation
export const validateMedicalData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check for required fields
  if (!data.patientName) {
    errors.push('Patient name is required')
  }

  if (!data.dateOfBirth) {
    errors.push('Date of birth is required')
  }

  if (!data.gender) {
    errors.push('Gender is required')
  }

  // Validate date formats
  if (data.dateOfBirth && !validateDateOfBirth(data.dateOfBirth)) {
    errors.push('Invalid date of birth')
  }

  // Validate phone number if provided
  if (data.phoneNumber && !validatePhoneNumber(data.phoneNumber)) {
    errors.push('Invalid phone number format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// File type detection
export const getFileType = (file: File): string => {
  if (file.type.startsWith('image/')) {
    return 'image'
  }
  if (file.type === 'application/pdf') {
    return 'pdf'
  }
  return 'unknown'
}

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Format validation results
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return ''
  if (errors.length === 1) return errors[0]
  return errors.join(', ')
}

// Custom validation hooks
export const useValidation = () => {
  const validateForm = (data: any, schema: z.ZodSchema) => {
    try {
      schema.parse(data)
      return { isValid: true, errors: [] }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(err => err.message)
        }
      }
      return { isValid: false, errors: ['Validation failed'] }
    }
  }

  return { validateForm }
}

export default {
  validateFile,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateDateOfBirth,
  validateMedicalData,
  sanitizeString,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeFileName,
  getFileType,
  getFileExtension,
  formatValidationErrors,
  useValidation
}