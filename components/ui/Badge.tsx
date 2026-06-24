import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'purple' | 'teal' | 'amber' | 'default'
  dot?: boolean
  dotPulse?: boolean
  style?: React.CSSProperties
}

export default function Badge({
  children,
  className = '',
  variant = 'default',
  dot = false,
  dotPulse = false,
  style,
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-saan-surface border border-saan-border text-saan-text',
    purple: 'bg-saan-purple/10 border border-saan-purple/20 text-saan-purple-light',
    teal: 'bg-saan-teal/10 border border-saan-teal/20 text-saan-teal-light',
    amber: 'bg-saan-amber/10 border border-saan-amber/20 text-saan-amber',
  }

  const dotStyles = {
    default: 'bg-saan-text',
    purple: 'bg-saan-purple',
    teal: 'bg-saan-teal',
    amber: 'bg-saan-amber',
  }

  return (
    <span
      style={style}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full tracking-wide transition-all duration-200',
        variantStyles[variant],
        className
      )}
    >
      {dot && dotPulse ? (
        <span className="relative flex h-2 w-2">
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotStyles[variant])}></span>
          <span className={clsx('relative inline-flex rounded-full h-2 w-2', dotStyles[variant])}></span>
        </span>
      ) : dot ? (
        <span className={clsx('h-1.5 w-1.5 rounded-full', dotStyles[variant])}></span>
      ) : null}
      {children}
    </span>
  )
}
