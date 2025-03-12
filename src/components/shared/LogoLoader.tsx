'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// List of logos in display order, hey-oko_logo should be last
const LOGOS = [
  'aa.svg',
  'barclays.svg',
  'bbva.svg',
  'bunge.svg',
  'cisco.svg',
  'dazn.svg',
  'electrolux.svg',
  'fiserv.svg',
  'flightglobal.svg',
  'franke.svg',
  'investec.svg',
  'lush.svg',
  'marriott.svg',
  'maserati.svg',
  'nature.svg',
  'swedbank.svg',
  'visa.svg',
  'hey-oko_logo.svg'
]

export function LogoLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRefs = useRef<(HTMLImageElement | null)[]>([])
  const svgMaskRef = useRef<SVGSVGElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !svgMaskRef.current || !overlayRef.current) return

    const tl = gsap.timeline()

    // Hide all logos initially except the first one
    logoRefs.current.forEach((logo, index) => {
      if (logo) {
        gsap.set(logo, { 
          opacity: index === 0 ? 1 : 0
        })
      }
    })

    // Create animation sequence for logo transitions
    logoRefs.current.forEach((logo, index) => {
      if (logo) {
        // For all logos except the last one
        if (index < LOGOS.length - 1) {
          tl.to(logo, {
            opacity: 0,
            duration: 0.15
          })
          // Show next logo
          .set(logoRefs.current[index + 1], {
            opacity: 1
          }, '<')
        } else {
          // For the last logo (hey-oko_logo)
          tl.to(logo, {
            opacity: 1,
            duration: 1
          })
          // Pause to show the final logo
          .to({}, { duration: 1 })
          // Add blur, fade out, and scale down to the logo
          .to(logo, { 
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.8,
            duration: 0.75,
            ease: "power2.out"
          })
          // Fade out and scale down the background at the same time
          .to(overlayRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.75,
            ease: "power2.out"
          }, '<')
          .set(containerRef.current, { 
            display: 'none'
          })
        }
      }
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Black overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black"
      />
      
      {/* We'll keep the SVG mask in the DOM but we won't use it for the animation */}
      <svg 
        ref={svgMaskRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ 
          width: '100%', 
          height: '100%',
          transformOrigin: 'center center'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="logo-mask">
            <rect width="100%" height="100%" fill="black" />
            <image
              href="/images/logos/hey-oko_logo.svg"
              width="200"
              height="160" 
              x="50%"
              y="50%"
              transform="translate(-100, -80)"
              fill="white"
            />
          </mask>
        </defs>
        
        <rect 
          width="100%" 
          height="100%" 
          fill="white" 
          mask="url(#logo-mask)" 
        />
      </svg>
      
      {/* Regular logo sequence */}
      {LOGOS.map((logo, index) => (
        <img
          key={logo}
          ref={(el) => {
            if (el) {
              logoRefs.current[index] = el
            }
          }}
          src={`/images/logos/${logo}`}
          alt={`Logo ${index + 1}`}
          className="absolute w-32 h-32 object-contain [filter:brightness(0)_invert(1)]"
          style={{ opacity: 0 }}
        />
      ))}
    </div>
  )
} 