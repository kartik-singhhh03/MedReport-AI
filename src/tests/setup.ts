import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_HUGGINGFACE_API_KEY: 'test-hf-key',
  VITE_ANALYTICS_ID: 'test-analytics-id',
  VITE_SENTRY_DSN: 'test-sentry-dsn',
  VITE_ENABLE_AI_FEATURES: 'true',
  VITE_ENABLE_ANALYTICS: 'false',
  DEV: true,
  PROD: false,
  MODE: 'test'
}))

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockReturnThis()
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        download: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'test-url' } }))
      }))
    },
    functions: {
      invoke: vi.fn()
    }
  }
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' })
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useInView: () => true
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  },
  Toaster: () => <div data-testid="toaster" />
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Brain: () => <div data-testid="brain-icon" />,
  FileText: () => <div data-testid="file-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  CheckCircle: () => <div data-testid="check-icon" />,
  X: () => <div data-testid="close-icon" />,
  Wifi: () => <div data-testid="wifi-icon" />,
  WifiOff: () => <div data-testid="wifi-off-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  AlertTriangle: () => <div data-testid="warning-icon" />,
  Info: () => <div data-testid="info-icon" />,
  Home: () => <div data-testid="home-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Stethoscope: () => <div data-testid="stethoscope-icon" />,
  Microscope: () => <div data-testid="microscope-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Scan: () => <div data-testid="scan-icon" />,
  TrendingUp: () => <div data-testid="trending-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Award: () => <div data-testid="award-icon" />
}))

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-1234-5678-9012-345678901234'
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock Performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => 1000),
    getEntriesByType: vi.fn(() => [{
      loadEventEnd: 2000,
      loadEventStart: 1000,
      domContentLoadedEventEnd: 1500,
      fetchStart: 500,
      responseStart: 800
    }])
  }
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock fetch
global.fetch = vi.fn()

// Mock File API
global.File = vi.fn().mockImplementation((content, name, options) => ({
  name: name || 'test-file.pdf',
  size: content?.length || 1024,
  type: options?.type || 'application/pdf',
  lastModified: Date.now(),
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024))
}))

// Mock FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  result: 'test-result',
  onload: null,
  onerror: null
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url')

// Mock URL.revokeObjectURL
global.URL.revokeObjectURL = vi.fn()

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn()
}))

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test')

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn()
})

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true
})

// Mock window.innerHeight
Object.defineProperty(window, 'innerHeight', {
  value: 800,
  writable: true
})

// Mock document.body.scrollHeight
Object.defineProperty(document.body, 'scrollHeight', {
  value: 1000,
  writable: true
})

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true
})

// Mock navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Test Browser)',
  writable: true
})

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }
beforeAll(() => {
  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()
})

afterAll(() => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// Test utilities
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z'
}

export const mockReport = {
  id: 'test-report-id',
  user_id: 'test-user-id',
  filename: 'test-report.pdf',
  file_type: 'application/pdf',
  file_size: 1024,
  status: 'pending',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const mockAnalysisResult = {
  id: 'test-analysis-id',
  report_id: 'test-report-id',
  technical_analysis: 'Test technical analysis',
  layman_explanation_en: 'Test English explanation',
  layman_explanation_hi: 'Test Hindi explanation',
  recommendations: 'Test recommendations',
  health_score: 85,
  risk_factors: ['Test risk factor'],
  key_findings: ['Test finding'],
  status: 'completed',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const renderWithProviders = (component: React.ReactElement) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-testid="test-wrapper">
        {children}
      </div>
    )
  }

  return {
    ...render(component, { wrapper: AllTheProviders })
  }
}

export const waitForLoadingToFinish = () => {
  return waitFor(() => {
    expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument()
  })
}

export const mockFileUpload = (file: File) => {
  const input = screen.getByTestId('file-input') as HTMLInputElement
  fireEvent.change(input, { target: { files: [file] } })
}

export const mockApiResponse = (endpoint: string, response: any) => {
  ;(global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => response
  })
}

export const mockApiError = (endpoint: string, error: any) => {
  ;(global.fetch as any).mockRejectedValueOnce(error)
}

// Custom matchers
expect.extend({
  toHaveBeenCalledWithMatch(received: any, expected: any) {
    const pass = received.mock.calls.some((call: any[]) =>
      expect(call).toEqual(expect.arrayContaining([expected]))
    )
    return {
      pass,
      message: () => `expected ${received.getMockName()} to have been called with ${expected}`
    }
  }
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(expected: any): R
    }
  }
} 