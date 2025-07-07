import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Home, FileText, Info, LogOut, Sun, Moon, Monitor, Globe, Accessibility, Brain } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const { theme, setTheme, accessibilityMode, setAccessibilityMode } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/dashboard', label: t('nav.dashboard'), icon: FileText },
    { path: '/history', label: t('nav.history'), icon: Activity },
    { path: '/about', label: t('nav.about'), icon: Info },
  ]

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl"
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                MedReport AI
              </span>
              <p className="text-xs text-slate-400 -mt-1">Decode Your Health</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300">
                <ThemeIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-cyan-500/20 focus:outline-none">
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setTheme('light')}
                          className={`${
                            active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                          } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <Sun className="h-4 w-4 mr-3" />
                          Light
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setTheme('dark')}
                          className={`${
                            active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                          } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <Moon className="h-4 w-4 mr-3" />
                          Dark
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setTheme('system')}
                          className={`${
                            active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                          } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <Monitor className="h-4 w-4 mr-3" />
                          System
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Language Toggle */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300">
                <Globe className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-cyan-500/20 focus:outline-none">
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setLanguage('en')}
                          className={`${
                            active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                          } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                        >
                          🇺🇸 English
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setLanguage('hi')}
                          className={`${
                            active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                          } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                        >
                          🇮🇳 हिन्दी
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Accessibility Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAccessibilityMode(!accessibilityMode)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                accessibilityMode
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
              aria-label="Toggle accessibility mode"
            >
              <Accessibility className="h-5 w-5" />
            </motion.button>

            {/* User Menu */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.signOut')}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation