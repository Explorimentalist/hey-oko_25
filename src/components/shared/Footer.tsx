"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const marquee = marqueeRef.current
    const logoItems = marquee.querySelectorAll('.logo-item')
    
    if (!logoItems.length) return

    // Calculate proper spacing - logo width + gap to prevent overlap
    const logoWidth = 380 // Actual SVG width from the file
    const gap = 120 // Gap between logos to prevent overlap
    const itemSpacing = logoWidth + gap
    const screenWidth = window.innerWidth
    const wrapperWidth = itemSpacing * logoItems.length

    // Position items initially across the full width needed
    gsap.set(logoItems, {
      x: (i) => i * itemSpacing
    })

    // Calculate duration for 30-second max traverse time
    const duration = 30

    // Create infinite loop animation with proper ModifiersPlugin implementation
    gsap.to(logoItems, {
      duration: duration,
      ease: "none",
      x: `-=${wrapperWidth}`,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const position = parseFloat(x)
          // Only wrap when logo is completely off the left edge
          if (position < -logoWidth) {
            // Move to the right side, accounting for all logos
            return position + wrapperWidth
          }
          return position
        })
      },
      repeat: -1
    })

    return () => {
      gsap.killTweensOf(logoItems)
    }
  }, [])

  return (
    <footer className="py-8 mt-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-zinc-600 mb-4">Do you need some supply?</h2>
          <div className="space-x-4 mb-8">
            <a
              href="mailto:Ngatye@hey-oko.com"
              className="text-sm text-zinc-600 hover:text-white transition-colors"
            >
              Ngatye@hey-oko.com
            </a>
            <a
              href="https://www.linkedin.com/in/ngatye-brian-oko-64051b14/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Logo Marquee */}
      <div className="w-full mb-8 py-12">
        <div 
          ref={marqueeRef}
          className="relative h-48 text-body"
          style={{
            WebkitTextSizeAdjust: '100%',
            tabSize: 4,
            fontFeatureSettings: 'normal',
            fontVariationSettings: 'normal',
            WebkitTapHighlightColor: 'transparent',
            background: '#09090b',
            lineHeight: 'inherit',
            color: 'var(--foreground)',
            fontFamily: "'General Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            boxSizing: 'border-box',
            borderWidth: 0,
            borderStyle: 'solid',
            borderColor: '#e5e7eb',
            marginTop: '3rem',
            overflow: 'hidden'
          } as React.CSSProperties}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="logo-item absolute top-0 left-0 flex items-center justify-start">
              <img 
                src="/images/logos/hey-oko_logo.svg" 
                alt="Hey-Oko Logo"
                className="h-48 w-auto flex-shrink-0"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(100%)',
                  maxWidth: 'none'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Hey-Oko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 
