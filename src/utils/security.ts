// Security utilities for production

export function sanitizeInput(input: string): string {
  // Remove potentially harmful characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function validateCSRF(token: string): boolean {
  // Basic CSRF token validation
  return token && token.length > 10
}

export function rateLimit(key: string, limit: number = 10, window: number = 60000): boolean {
  const now = Date.now()
  const windowStart = now - window
  
  // Get existing requests from localStorage (in production, use Redis)
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]')
    .filter((timestamp: number) => timestamp > windowStart)
  
  if (requests.length >= limit) {
    return false
  }
  
  requests.push(now)
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(requests))
  return true
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function hashSensitiveData(data: string): string {
  // Simple hash for client-side (use proper hashing server-side)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}