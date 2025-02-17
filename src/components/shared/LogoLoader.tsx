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

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline()

    // Hide all logos initially except the first one
    logoRefs.current.forEach((logo, index) => {
      if (logo) {
        gsap.set(logo, { 
          opacity: index === 0 ? 1 : 0,
          scale: 0.92
        })
      }
    })

    // Create animation sequence
    logoRefs.current.forEach((logo, index) => {
      if (logo) {
        // For all logos except the last one
        if (index < LOGOS.length - 1) {
          tl.to(logo, {
            scale: 1,
            duration: 0.125,
            ease: 'power2.out'
          })
          .to(logo, {
            opacity: 0,
            duration: 0.125
          })
          // Show next logo
          .set(logoRefs.current[index + 1], {
            opacity: 1,
            scale: 0.92
          }, '<')
        } else {
          // For the last logo (hey-oko_logo)
          tl.to(logo, {
            scale: 1,
            duration: 2,
            ease: 'power2.out'
          })
          .to(logo, {
            opacity: 1,
            duration: 2
          })
        }
      }
    })

    // Add final exit animation
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut'
    }, '+=3')

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
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