import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'outlined' | 'filled' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  showPasswordToggle?: boolean
  helperText?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  showPasswordToggle = false,
  helperText,
  required = false,
  className = '',
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variantClasses = {
    default: 'bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500',
    outlined: 'bg-transparent border-2 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500',
    filled: 'bg-slate-800 border-b-2 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500',
    glass: 'bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-slate-300 focus:border-cyan-400 focus:ring-cyan-400'
  }

  const stateClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
    : success 
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
    : ''

  const widthClass = fullWidth ? 'w-full' : ''
  const iconPadding = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  const passwordPadding = showPasswordToggle ? 'pr-12' : ''

  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses,
    widthClass,
    iconPadding,
    passwordPadding,
    className
  ].filter(Boolean).join(' ')

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {icon && iconPosition === 'right' && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-slate-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input