import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  hover?: boolean
  clickable?: boolean
  className?: string
  onClick?: () => void
  animate?: boolean
  delay?: number
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  animate = true,
  delay = 0
}) => {
  const baseClasses = 'transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-slate-800/50 backdrop-blur-xl border border-slate-700/50',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    gradient: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-cyan-500/20',
    elevated: 'bg-slate-800 shadow-2xl border border-slate-700',
    outlined: 'bg-transparent border-2 border-cyan-500/30'
  }

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl' : ''
  const clickableClasses = clickable ? 'cursor-pointer' : ''

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    hoverClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ')

  const MotionComponent = animate ? motion.div : 'div'

  return (
    <MotionComponent
      className={classes}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </MotionComponent>
  )
}

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

// Card Body Component
interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
)

export default Card