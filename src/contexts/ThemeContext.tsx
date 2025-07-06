import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  accessibilityMode: boolean
  setAccessibilityMode: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [accessibilityMode, setAccessibilityMode] = useState(false)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedAccessibility = localStorage.getItem('accessibility-mode') === 'true'
    
    if (savedTheme) setTheme(savedTheme)
    if (savedAccessibility) setAccessibilityMode(savedAccessibility)
  }, [])

  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setEffectiveTheme(systemTheme)
      } else {
        setEffectiveTheme(theme)
      }
    }

    updateEffectiveTheme()
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateEffectiveTheme)
      return () => mediaQuery.removeEventListener('change', updateEffectiveTheme)
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('accessibility-mode', accessibilityMode.toString())
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(effectiveTheme)
    
    // Apply accessibility mode
    if (accessibilityMode) {
      document.documentElement.classList.add('accessibility-mode')
    } else {
      document.documentElement.classList.remove('accessibility-mode')
    }
  }, [theme, effectiveTheme, accessibilityMode])

  const value = {
    theme,
    effectiveTheme,
    setTheme,
    accessibilityMode,
    setAccessibilityMode
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}