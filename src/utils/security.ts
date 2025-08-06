import { createHash, randomBytes } from 'crypto'

// Security configuration
const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  API_RATE_LIMIT: 100, // requests per minute
  FILE_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  SANITIZATION_RULES: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTRIBUTES: ['class', 'id'],
    MAX_LENGTH: 10000
  }
}

// Password security
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const generateSalt = (): string => {
  return randomBytes(16).toString('hex')
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export const generateSecureToken = (): string => {
  return randomBytes(32).toString('hex')
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return ''
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '')
  
  // HTML entity encoding
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  // Limit length
  if (sanitized.length > SECURITY_CONFIG.SANITIZATION_RULES.MAX_LENGTH) {
    sanitized = sanitized.substring(0, SECURITY_CONFIG.SANITIZATION_RULES.MAX_LENGTH)
  }
  
  return sanitized.trim()
}

export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return ''
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // Remove script tags and event handlers
  const scripts = tempDiv.querySelectorAll('script')
  scripts.forEach(script => script.remove())
  
  // Remove event handlers from all elements
  const allElements = tempDiv.querySelectorAll('*')
  allElements.forEach(element => {
    const attributes = element.attributes
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i]
      if (attr.name.startsWith('on') || attr.name.startsWith('javascript:')) {
        element.removeAttribute(attr.name)
      }
    }
  })
  
  return tempDiv.innerHTML
}

// File security
export const validateFileSecurity = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > SECURITY_CONFIG.FILE_SIZE_LIMIT) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(SECURITY_CONFIG.FILE_SIZE_LIMIT / 1024 / 1024)}MB limit`
    }
  }
  
  // Check file type
  if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed'
    }
  }
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png']
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'File extension not allowed'
    }
  }
  
  return { isValid: true }
}

export const scanFileForThreats = async (file: File): Promise<{ isSafe: boolean; threats: string[] }> => {
  const threats: string[] = []
  
  // Check file signature (magic numbers)
  const buffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  
  // PDF signature check
  if (file.type === 'application/pdf') {
    const pdfSignature = [0x25, 0x50, 0x44, 0x46] // %PDF
    const isPDF = pdfSignature.every((byte, index) => uint8Array[index] === byte)
    if (!isPDF) {
      threats.push('Invalid PDF signature')
    }
  }
  
  // Image signature checks
  if (file.type.startsWith('image/')) {
    const jpegSignature = [0xFF, 0xD8, 0xFF]
    const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
    
    const isJPEG = jpegSignature.every((byte, index) => uint8Array[index] === byte)
    const isPNG = pngSignature.every((byte, index) => uint8Array[index] === byte)
    
    if (!isJPEG && !isPNG) {
      threats.push('Invalid image signature')
    }
  }
  
  // Check for executable content
  const executableSignatures = [
    [0x4D, 0x5A], // MZ (Windows executable)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux executable)
    [0xFE, 0xED, 0xFA, 0xCE], // Mach-O (macOS executable)
  ]
  
  for (const signature of executableSignatures) {
    if (signature.every((byte, index) => uint8Array[index] === byte)) {
      threats.push('Executable content detected')
      break
    }
  }
  
  return {
    isSafe: threats.length === 0,
    threats
  }
}

// Rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  isAllowed(identifier: string, limit: number = SECURITY_CONFIG.API_RATE_LIMIT): boolean {
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now])
      return true
    }
    
    const requests = this.requests.get(identifier)!
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= limit) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
  
  getRemainingRequests(identifier: string, limit: number = SECURITY_CONFIG.API_RATE_LIMIT): number {
    const now = Date.now()
    const windowMs = 60 * 1000
    
    if (!this.requests.has(identifier)) {
      return limit
    }
    
    const requests = this.requests.get(identifier)!
    const validRequests = requests.filter(time => now - time < windowMs)
    
    return Math.max(0, limit - validRequests.length)
  }
}

export const rateLimiter = new RateLimiter()

// Session security
export const generateSessionId = (): string => {
  return randomBytes(32).toString('hex')
}

export const validateSession = (sessionData: any): boolean => {
  if (!sessionData || !sessionData.userId || !sessionData.createdAt) {
    return false
  }
  
  const now = Date.now()
  const sessionAge = now - sessionData.createdAt
  
  if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
    return false
  }
  
  return true
}

// CSRF protection
export const generateCSRFToken = (): string => {
  return randomBytes(32).toString('hex')
}

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken
}

// XSS protection
export const escapeHTML = (str: string): string => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi,
    /<input/gi,
    /<textarea/gi,
    /<select/gi,
    /<button/gi,
    /<link/gi,
    /<meta/gi,
    /<style/gi,
    /<link/gi,
    /<base/gi,
    /<bgsound/gi,
    /<xmp/gi,
    /<plaintext/gi,
    /<listing/gi,
    /<frameset/gi,
    /<frame/gi,
    /<noframes/gi,
    /<noscr/gi,
    /<noscript/gi,
    /<title/gi,
    /<head/gi,
    /<body/gi,
    /<html/gi,
    /<xml/gi,
    /<xss/gi,
    /<svg/gi,
    /<math/gi,
    /<applet/gi,
    /<marquee/gi,
    /<isindex/gi,
    /<blink/gi,
    /<layer/gi,
    /<ilayer/gi,
    /<bgsound/gi,
    /<keygen/gi,
    /<basefont/gi,
    /<bdo/gi,
    /<dir/gi,
    /<font/gi,
    /<center/gi,
    /<strike/gi,
    /<tt/gi,
    /<u/gi,
    /<big/gi,
    /<small/gi,
    /<sub/gi,
    /<sup/gi,
    /<acronym/gi,
    /<abbr/gi,
    /<cite/gi,
    /<code/gi,
    /<dfn/gi,
    /<em/gi,
    /<kbd/gi,
    /<samp/gi,
    /<strong/gi,
    /<var/gi,
    /<address/gi,
    /<blockquote/gi,
    /<dd/gi,
    /<dl/gi,
    /<dt/gi,
    /<li/gi,
    /<ol/gi,
    /<ul/gi,
    /<fieldset/gi,
    /<legend/gi,
    /<label/gi,
    /<optgroup/gi,
    /<option/gi,
    /<caption/gi,
    /<col/gi,
    /<colgroup/gi,
    /<table/gi,
    /<tbody/gi,
    /<td/gi,
    /<tfoot/gi,
    /<th/gi,
    /<thead/gi,
    /<tr/gi,
    /<area/gi,
    /<img/gi,
    /<map/gi,
    /<param/gi,
    /<source/gi,
    /<track/gi,
    /<video/gi,
    /<audio/gi,
    /<canvas/gi,
    /<command/gi,
    /<datalist/gi,
    /<details/gi,
    /<dialog/gi,
    /<menu/gi,
    /<menuitem/gi,
    /<meter/gi,
    /<output/gi,
    /<progress/gi,
    /<ruby/gi,
    /<rt/gi,
    /<rp/gi,
    /<time/gi,
    /<wbr/gi,
    /<article/gi,
    /<aside/gi,
    /<footer/gi,
    /<header/gi,
    /<main/gi,
    /<nav/gi,
    /<section/gi,
    /<figure/gi,
    /<figcaption/gi,
    /<hgroup/gi,
    /<mark/gi,
    /<s/gi,
    /<del/gi,
    /<ins/gi,
    /<q/gi,
    /<samp/gi,
    /<var/gi,
    /<kbd/gi,
    /<dfn/gi,
    /<abbr/gi,
    /<acronym/gi,
    /<cite/gi,
    /<code/gi,
    /<em/gi,
    /<strong/gi,
    /<b/gi,
    /<i/gi,
    /<u/gi,
    /<strike/gi,
    /<big/gi,
    /<small/gi,
    /<sub/gi,
    /<sup/gi,
    /<tt/gi,
    /<font/gi,
    /<center/gi,
    /<dir/gi,
    /<bdo/gi,
    /<basefont/gi,
    /<keygen/gi,
    /<bgsound/gi,
    /<ilayer/gi,
    /<layer/gi,
    /<blink/gi,
    /<isindex/gi,
    /<marquee/gi,
    /<applet/gi,
    /<math/gi,
    /<svg/gi,
    /<xss/gi,
    /<xml/gi,
    /<html/gi,
    /<body/gi,
    /<head/gi,
    /<title/gi,
    /<noscript/gi,
    /<noscr/gi,
    /<noframes/gi,
    /<frame/gi,
    /<frameset/gi,
    /<listing/gi,
    /<plaintext/gi,
    /<xmp/gi,
    /<bgsound/gi,
    /<base/gi,
    /<link/gi,
    /<style/gi,
    /<meta/gi,
    /<button/gi,
    /<select/gi,
    /<textarea/gi,
    /<input/gi,
    /<form/gi,
    /<embed/gi,
    /<object/gi,
    /<iframe/gi,
    /<script/gi
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

// Security headers
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
}

// Audit logging
export const logSecurityEvent = (event: string, details: any): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  console.log('Security Event:', logEntry)
  
  // In production, send to security monitoring service
  if (import.meta.env.PROD) {
    // Send to security monitoring service
    // securityMonitoringService.log(logEntry)
  }
}

export default {
  hashPassword,
  generateSalt,
  verifyPassword,
  generateSecureToken,
  sanitizeInput,
  sanitizeHTML,
  validateFileSecurity,
  scanFileForThreats,
  rateLimiter,
  generateSessionId,
  validateSession,
  generateCSRFToken,
  validateCSRFToken,
  escapeHTML,
  detectXSS,
  getSecurityHeaders,
  logSecurityEvent
}