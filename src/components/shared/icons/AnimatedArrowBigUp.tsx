'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowUp } from 'lucide-react'

export function AnimatedArrowBigUp() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(1.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(Math.random() * 2 + 0.5)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [duration])

  useEffect(() => {
    if (!containerRef.current) return

    const arrows = containerRef.current.querySelectorAll('[data-arrow]')

    arrows.forEach((arrow) => {
      const isFirst = arrow.getAttribute('data-arrow') === 'first'

      gsap.fromTo(
        arrow,
        { y: isFirst ? 0 : 40 },
        {
          y: isFirst ? -40 : 0,
          duration,
          repeat: -1,
          ease: isFirst ? 'power1.in' : 'linear',
        }
      )
    })
  }, [duration])

  return (
    <div ref={containerRef} className="relative w-8 h-8 overflow-hidden">
      <div data-arrow="first" className="absolute inset-0">
        <ArrowUp size={32} strokeWidth={1.5} />
      </div>
      <div data-arrow="second" className="absolute inset-0">
        <ArrowUp size={32} strokeWidth={1.5} />
      </div>
    </div>
  )
}
