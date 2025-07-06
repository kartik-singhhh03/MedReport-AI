import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)' } : {}}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}