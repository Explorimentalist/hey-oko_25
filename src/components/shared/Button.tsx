'use client'

import { forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-icon' | 'primary-icon-left' | 'secondary' | 'tertiary' | 'pill'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  asLink?: boolean
  href?: string
  target?: string
  rel?: string
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    children, 
    asLink = false,
    href,
    target,
    rel,
    icon,
    ...props 
  }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-white text-black hover:bg-zinc-200 rounded-md transition-colors',
      'primary-icon': 'bg-white text-black hover:bg-zinc-200 rounded-md transition-all duration-300 ease-out group overflow-hidden',
      'primary-icon-left': 'bg-white text-black hover:bg-zinc-200 rounded-md transition-all duration-300 ease-out group overflow-hidden',
      secondary: 'bg-black/80 backdrop-blur-md text-white hover:bg-black/90 rounded-full transition-colors',
      tertiary: 'text-zinc-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors',
      pill: 'bg-white/10 backdrop-blur-sm text-white rounded-full transition-colors'
    }
    
    const sizes = {
      sm: {
        primary: 'px-6 py-2 text-sm',
        'primary-icon': 'px-6 py-2 text-sm group-hover:pr-12',
        'primary-icon-left': 'px-6 py-2 text-sm group-hover:pl-12',
        secondary: 'px-4 py-2 text-sm',
        tertiary: 'px-4 py-2 text-sm',
        pill: 'px-3 py-1.5 text-xs'
      },
      md: {
        primary: 'px-8 py-4 text-base',
        'primary-icon': 'px-8 py-4 text-base group-hover:pr-16',
        'primary-icon-left': 'px-8 py-4 text-base group-hover:pl-16',
        secondary: 'px-6 py-3 text-base',
        tertiary: 'px-5 py-3 text-xl',
        pill: 'px-4 py-2 text-sm'
      },
      lg: {
        primary: 'px-10 py-5 text-lg',
        'primary-icon': 'px-10 py-5 text-lg group-hover:pr-20',
        'primary-icon-left': 'px-10 py-5 text-lg group-hover:pl-20',
        secondary: 'px-8 py-4 text-lg',
        tertiary: 'px-6 py-4 text-2xl',
        pill: 'px-6 py-3 text-base'
      }
    }
    
    const combinedClassName = [
      baseStyles,
      variants[variant],
      sizes[size][variant],
      className
    ].filter(Boolean).join(' ')
    
    const renderContent = () => {
      if (variant === 'primary-icon') {
        return (
          <>
            <span>{children}</span>
            {icon && (
              <span className="w-0 ml-0 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:opacity-100 group-hover:w-5 group-hover:ml-2">
                {icon}
              </span>
            )}
          </>
        )
      }
      if (variant === 'primary-icon-left') {
        return (
          <>
            {icon && (
              <span className="w-0 mr-0 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:opacity-100 group-hover:w-5 group-hover:mr-2">
                {icon}
              </span>
            )}
            <span>{children}</span>
          </>
        )
      }
      return children
    }
    
    if (asLink && href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      )
    }
    
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClassName}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {renderContent()}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }