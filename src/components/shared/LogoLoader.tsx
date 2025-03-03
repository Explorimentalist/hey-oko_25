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
          // Hide the regular logo display
          .set(logo, { opacity: 0 })
          // Show the SVG mask for the reveal effect
          .set(svgMaskRef.current, { opacity: 1 })
        }
      }
    })

    // Create the reveal animation - scale the SVG logo mask to reveal content
    tl.to(svgMaskRef.current, {
      scale: 100, // Scale up even more dramatically to ensure full screen reveal
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        // Remove the loader from the DOM when animation completes
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
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
      
      {/* SVG Mask for the reveal effect */}
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
            {/* Use an image element that references the Hey-Oko logo SVG file */}
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
        
        {/* Apply the mask to reveal the content */}
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