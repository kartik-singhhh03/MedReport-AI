// Application configuration
export const APP_CONFIG = {
  NAME: 'MedReport AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-Powered Medical Report Analyzer',
  AUTHOR: 'MedReport AI Team',
  LICENSE: 'MIT',
  REPOSITORY: 'https://github.com/medreport-ai/medreport-ai',
  WEBSITE: 'https://medreport-ai.com',
  SUPPORT_EMAIL: 'support@medreport-ai.com',
  PRIVACY_POLICY: 'https://medreport-ai.com/privacy',
  TERMS_OF_SERVICE: 'https://medreport-ai.com/terms',
  DOCUMENTATION: 'https://docs.medreport-ai.com'
}

// Environment configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_TEST: import.meta.env.MODE === 'test',
  API_URL: import.meta.env.VITE_API_URL || 'https://api.medreport-ai.com',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  HUGGINGFACE_API_KEY: import.meta.env.VITE_HUGGINGFACE_API_KEY,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ENABLE_AI_FEATURES: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
}

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_UP: '/auth/signup',
    SIGN_IN: '/auth/signin',
    SIGN_OUT: '/auth/signout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  
  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    ANALYZE: (id: string) => `/reports/${id}/analyze`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    SHARE: (id: string) => `/reports/${id}/share`
  },
  
  // Analysis
  ANALYSIS: {
    START: '/analysis/start',
    STATUS: (id: string) => `/analysis/${id}/status`,
    RESULT: (id: string) => `/analysis/${id}/result`,
    CANCEL: (id: string) => `/analysis/${id}/cancel`
  },
  
  // User management
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    UPDATE_PREFERENCES: '/users/preferences',
    DELETE_ACCOUNT: '/users/account',
    EXPORT_DATA: '/users/data/export'
  },
  
  // Health checks
  HEALTH: {
    STATUS: '/health',
    READY: '/health/ready',
    LIVE: '/health/live'
  },
  
  // Analytics
  ANALYTICS: {
    TRACK: '/analytics/track',
    EVENTS: '/analytics/events',
    METRICS: '/analytics/metrics'
  }
}

// File upload configuration
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
  MAX_FILES_PER_UPLOAD: 5,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000 // 30 seconds
}

// AI/ML configuration
export const AI_CONFIG = {
  MODELS: {
    OCR: 'microsoft/trocr-base-handwritten',
    NLP: 'microsoft/DialoGPT-medium',
    CLASSIFICATION: 'microsoft/DialoGPT-medium',
    SUMMARIZATION: 'facebook/bart-large-cnn',
    TRANSLATION: 'Helsinki-NLP/opus-mt-en-hi'
  },
  PARAMETERS: {
    MAX_TOKENS: 2048,
    TEMPERATURE: 0.7,
    TOP_P: 0.9,
    FREQUENCY_PENALTY: 0.0,
    PRESENCE_PENALTY: 0.0
  },
  TIMEOUT: 120000, // 2 minutes
  RETRY_ATTEMPTS: 3,
  BATCH_SIZE: 1
}

// UI/UX configuration
export const UI_CONFIG = {
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  },
  LANGUAGES: {
    EN: 'en',
    HI: 'hi'
  },
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'ease-in-out'
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  COLORS: {
    PRIMARY: '#0ea5e9',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6'
  }
}

// Feature flags
export const FEATURES = {
  AI_ANALYSIS: true,
  MULTI_LANGUAGE: true,
  OFFLINE_MODE: true,
  FILE_UPLOAD: true,
  REPORT_SHARING: true,
  EXPORT_PDF: true,
  REAL_TIME_PROCESSING: true,
  ADVANCED_ANALYTICS: true,
  USER_PREFERENCES: true,
  NOTIFICATIONS: true,
  DARK_MODE: true,
  ACCESSIBILITY: true,
  PWA: true,
  SOCIAL_LOGIN: false,
  TEAM_COLLABORATION: false,
  API_INTEGRATIONS: false
}

// Security configuration
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  API_RATE_LIMIT: 100, // requests per minute
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  HASH_ALGORITHM: 'SHA-256'
}

// Performance configuration
export const PERFORMANCE_CONFIG = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300, // 300ms
  THROTTLE_DELAY: 100, // 100ms
  LAZY_LOAD_OFFSET: 100, // 100px
  IMAGE_OPTIMIZATION: {
    QUALITY: 0.8,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080
  },
  BUNDLE_ANALYSIS: false,
  SERVICE_WORKER: true
}

// Analytics configuration
export const ANALYTICS_CONFIG = {
  ENABLED: ENV_CONFIG.ENABLE_ANALYTICS,
  TRACKING_ID: ENV_CONFIG.ANALYTICS_ID,
  EVENTS: {
    PAGE_VIEW: 'page_view',
    FILE_UPLOAD: 'file_upload',
    ANALYSIS_START: 'analysis_start',
    ANALYSIS_COMPLETE: 'analysis_complete',
    REPORT_DOWNLOAD: 'report_download',
    REPORT_SHARE: 'report_share',
    USER_SIGNUP: 'user_signup',
    USER_LOGIN: 'user_login',
    FEATURE_USAGE: 'feature_usage',
    ERROR: 'error'
  },
  PROPERTIES: {
    USER_ID: 'user_id',
    SESSION_ID: 'session_id',
    PAGE_URL: 'page_url',
    REFERRER: 'referrer',
    USER_AGENT: 'user_agent',
    LANGUAGE: 'language',
    THEME: 'theme'
  }
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Network connection failed. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    RATE_LIMITED: 'Too many requests. Please try again later.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Password must be at least 8 characters long.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    INVALID_FILE_TYPE: 'File type not supported.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_PHONE: 'Please enter a valid phone number.'
  },
  UPLOAD: {
    FAILED: 'File upload failed. Please try again.',
    INVALID_FILE: 'Invalid file format. Please upload a valid file.',
    SIZE_EXCEEDED: 'File size exceeds the maximum limit of 10MB.',
    UPLOAD_CANCELLED: 'File upload was cancelled.',
    NETWORK_ERROR: 'Network error during upload. Please try again.'
  },
  ANALYSIS: {
    FAILED: 'Analysis failed. Please try again.',
    TIMEOUT: 'Analysis timed out. Please try again.',
    INVALID_REPORT: 'Invalid report format. Please upload a valid medical report.',
    PROCESSING_ERROR: 'Error processing report. Please try again.',
    AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable. Please try again later.'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ACCOUNT_LOCKED: 'Account is temporarily locked due to too many failed attempts.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before continuing.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    TOKEN_INVALID: 'Invalid or expired token. Please log in again.'
  }
}

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD: {
    COMPLETED: 'File uploaded successfully.',
    PROCESSING: 'File uploaded and processing started.'
  },
  ANALYSIS: {
    COMPLETED: 'Analysis completed successfully.',
    STARTED: 'Analysis started successfully.'
  },
  AUTH: {
    LOGIN: 'Logged in successfully.',
    LOGOUT: 'Logged out successfully.',
    SIGNUP: 'Account created successfully. Please check your email for verification.',
    PASSWORD_RESET: 'Password reset email sent successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.'
  },
  GENERAL: {
    SAVED: 'Changes saved successfully.',
    DELETED: 'Item deleted successfully.',
    EXPORTED: 'Data exported successfully.',
    SHARED: 'Report shared successfully.'
  }
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  OFFLINE_DATA: 'offline_data',
  CACHE: 'app_cache',
  SESSION_ID: 'session_id'
}

// Route paths
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  RESULT: '/result',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms'
}

// Medical report types
export const REPORT_TYPES = {
  BLOOD_TEST: 'blood_test',
  URINE_TEST: 'urine_test',
  X_RAY: 'x_ray',
  MRI: 'mri',
  CT_SCAN: 'ct_scan',
  ECG: 'ecg',
  PRESCRIPTION: 'prescription',
  DISCHARGE_SUMMARY: 'discharge_summary',
  OPERATION_REPORT: 'operation_report',
  PATHOLOGY_REPORT: 'pathology_report',
  RADIOLOGY_REPORT: 'radiology_report',
  OTHER: 'other'
}

// Analysis status
export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  RESEARCHER: 'researcher'
}

export default {
  APP_CONFIG,
  ENV_CONFIG,
  API_ENDPOINTS,
  FILE_CONFIG,
  AI_CONFIG,
  UI_CONFIG,
  FEATURES,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  ANALYTICS_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  REPORT_TYPES,
  ANALYSIS_STATUS,
  USER_ROLES
}