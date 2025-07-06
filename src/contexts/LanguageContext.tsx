import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.about': 'About',
    'nav.signOut': 'Sign Out',
    
    // Home page
    'home.title': 'MediSimplify',
    'home.subtitle': 'Understand Your Medical Reports with AI',
    'home.description': 'Upload your medical reports and get detailed analysis with simple explanations in your language.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    
    // Dashboard
    'dashboard.title': 'Upload Medical Report',
    'dashboard.subtitle': 'Get AI-powered analysis of your medical documents',
    'dashboard.uploadArea': 'Drop your medical report here or click to browse',
    'dashboard.supportedFiles': 'Supported formats: PDF, JPG, PNG (Max 10MB)',
    'dashboard.analyzing': 'Analyzing your report...',
    'dashboard.completed': 'Analysis completed',
    
    // Results
    'results.technicalAnalysis': 'Technical Analysis',
    'results.simpleExplanation': 'Simple Explanation',
    'results.recommendations': 'Recommendations',
    'results.downloadPDF': 'Download PDF',
    'results.backToHistory': 'Back to History',
    
    // History
    'history.title': 'Report History',
    'history.noReports': 'No reports found',
    'history.status.processing': 'Processing',
    'history.status.completed': 'Completed',
    'history.status.failed': 'Failed',
    
    // About
    'about.title': 'About MediSimplify',
    'about.howItWorks': 'How It Works',
    'about.disclaimer': 'Medical Disclaimer',
    'about.disclaimerText': 'This tool is for educational purposes only. Always consult with healthcare professionals for medical advice.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.upload': 'Upload',
    'common.view': 'View',
    'common.delete': 'Delete',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.about': 'हमारे बारे में',
    'nav.signOut': 'साइन आउट',
    
    // Home page
    'home.title': 'मेडिसिम्प्लिफाई',
    'home.subtitle': 'AI के साथ अपनी मेडिकल रिपोर्ट्स को समझें',
    'home.description': 'अपनी मेडिकल रिपोर्ट्स अपलोड करें और अपनी भाषा में सरल व्याख्या के साथ विस्तृत विश्लेषण प्राप्त करें।',
    'home.getStarted': 'शुरू करें',
    'home.learnMore': 'और जानें',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.dontHaveAccount': 'खाता नहीं है?',
    'auth.alreadyHaveAccount': 'पहले से खाता है?',
    
    // Dashboard
    'dashboard.title': 'मेडिकल रिपोर्ट अपलोड करें',
    'dashboard.subtitle': 'अपने मेडिकल दस्तावेजों का AI-संचालित विश्लेषण प्राप्त करें',
    'dashboard.uploadArea': 'अपनी मेडिकल रिपोर्ट यहाँ छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    'dashboard.supportedFiles': 'समर्थित प्रारूप: PDF, JPG, PNG (अधिकतम 10MB)',
    'dashboard.analyzing': 'आपकी रिपोर्ट का विश्लेषण हो रहा है...',
    'dashboard.completed': 'विश्लेषण पूर्ण',
    
    // Results
    'results.technicalAnalysis': 'तकनीकी विश्लेषण',
    'results.simpleExplanation': 'सरल व्याख्या',
    'results.recommendations': 'सुझाव',
    'results.downloadPDF': 'PDF डाउनलोड करें',
    'results.backToHistory': 'इतिहास पर वापस जाएं',
    
    // History
    'history.title': 'रिपोर्ट इतिहास',
    'history.noReports': 'कोई रिपोर्ट नहीं मिली',
    'history.status.processing': 'प्रसंस्करण',
    'history.status.completed': 'पूर्ण',
    'history.status.failed': 'असफल',
    
    // About
    'about.title': 'मेडिसिम्प्लिफाई के बारे में',
    'about.howItWorks': 'यह कैसे काम करता है',
    'about.disclaimer': 'चिकित्सा अस्वीकरण',
    'about.disclaimerText': 'यह उपकरण केवल शिक्षा के लिए है। चिकित्सा सलाह के लिए हमेशा स्वास्थ्य पेशेवरों से सलाह लें।',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.upload': 'अपलोड',
    'common.view': 'देखें',
    'common.delete': 'हटाएं',
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}