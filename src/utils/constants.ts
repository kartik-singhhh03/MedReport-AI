// Application constants
export const APP_CONFIG = {
  name: 'MedReport AI',
  version: '1.0.0',
  description: 'AI-powered medical report analyzer',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  maxReportsPerUser: 50,
  maxStoragePerUser: 500 * 1024 * 1024, // 500MB
}

export const API_ENDPOINTS = {
  reports: '/api/reports',
  analysis: '/api/analysis',
  upload: '/api/upload',
  health: '/api/health'
}

export const STORAGE_KEYS = {
  theme: 'medreport_theme',
  language: 'medreport_language',
  accessibility: 'medreport_accessibility',
  onboarding: 'medreport_onboarding_complete'
}

export const ERROR_MESSAGES = {
  fileTooBig: 'File size exceeds 10MB limit',
  invalidFileType: 'Only PDF, JPEG, and PNG files are supported',
  uploadFailed: 'Failed to upload file. Please try again.',
  analysisFailed: 'AI analysis failed. Please try again.',
  networkError: 'Network error. Please check your connection.',
  unauthorized: 'Please sign in to continue',
  rateLimited: 'Too many requests. Please wait before trying again.'
}

export const SUCCESS_MESSAGES = {
  uploadComplete: 'File uploaded successfully!',
  analysisComplete: 'AI analysis completed!',
  reportDeleted: 'Report deleted successfully',
  settingsSaved: 'Settings saved successfully'
}

export const MEDICAL_CATEGORIES = [
  'Blood Tests',
  'Urine Tests',
  'Imaging (X-Ray, MRI, CT)',
  'Pathology Reports',
  'Cardiology Reports',
  'Endocrinology Reports',
  'General Health Checkup'
]

export const HEALTH_SCORE_RANGES = {
  excellent: { min: 85, max: 100, color: 'green' },
  good: { min: 70, max: 84, color: 'blue' },
  fair: { min: 55, max: 69, color: 'yellow' },
  poor: { min: 0, max: 54, color: 'red' }
}