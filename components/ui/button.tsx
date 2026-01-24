import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Reusable Button Component with Tailwind variants - Modern 2026 Design
 * React Compiler will automatically memoize this component
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 shine hover-lift'
    
    const variants = {
      primary: 'bg-gradient-primary text-white hover:shadow-glow-primary focus-visible:ring-primary border border-primary-light/20',
      secondary: 'glass-strong text-gray-200 hover:glass hover:text-white focus-visible:ring-gray-400 border border-white/10',
      ghost: 'hover:glass text-gray-300 hover:text-white',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-glow-primary focus-visible:ring-red-600 border border-red-500/20',
    }
    
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-13 px-7 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
