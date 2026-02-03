'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown } from 'lucide-react'

export function AnimatedArrowBigDown() {
  const containerRef = useRef<HTMLDivElement>(null)
  const duration = 1.5

  useEffect(() => {
    if (!containerRef.current) return

    const arrows = containerRef.current.querySelectorAll('[data-arrow]')

    arrows.forEach((arrow) => {
      const isFirst = arrow.getAttribute('data-arrow') === 'first'

      gsap.fromTo(
        arrow,
        { y: isFirst ? 0 : -36 },
        {
          y: isFirst ? 36 : 0,
          duration,
          repeat: -1,
          ease: 'circ.inOut',
        }
      )
    })
  }, [])

  return (
    <div ref={containerRef} className="relative w-8 h-8 overflow-hidden">
      <div data-arrow="first" className="absolute inset-0">
        <ArrowDown size={32} strokeWidth={1.5} />
      </div>
      <div data-arrow="second" className="absolute inset-0">
        <ArrowDown size={32} strokeWidth={1.5} />
      </div>
    </div>
  )
}
