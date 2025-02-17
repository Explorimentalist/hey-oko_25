'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function HomeHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    const tl = gsap.timeline()
    tl.from(heroRef.current, {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power3.out'
    })
  }, [])

  return (
    <section ref={heroRef} className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Design is a hell of a drug.</h1>
        {/* <p className="text-xl text-gray-600">UI/UX • 3D Design • Motion Graphics • Branding</p> */}
      </div>
    </section>
  )
} 