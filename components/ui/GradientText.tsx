import React from 'react'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p'
}

export default function GradientText({
  children,
  className = '',
  from = 'from-saan-purple-light',
  to = 'to-saan-teal-light',
  as: Component = 'span',
}: GradientTextProps) {
  return (
    <Component
      className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent font-extrabold ${className}`}
    >
      {children}
    </Component>
  )
}
