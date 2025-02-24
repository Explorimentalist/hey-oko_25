'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' }
]

export function NavigationProgress() {
  const [activeSection, setActiveSection] = useState('')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const labelRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleHover = (id: string, isEntering: boolean) => {
    setHoveredSection(isEntering ? id : null)
    
    if (isEntering && labelRefs.current[id]) {
      gsap.fromTo(
        labelRefs.current[id],
        { 
          opacity: 0,
          x: -10
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        }
      )
    }
  }

  const handleClick = (sectionId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: `#${sectionId}`,
      ease: 'power2.inOut'
    })
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
      {sections.map(({ id, label }) => (
        <div
          key={id}
          className="relative group flex justify-end"
          onMouseEnter={() => handleHover(id, true)}
          onMouseLeave={() => handleHover(id, false)}
          onClick={() => handleClick(id)}
        >
          <div 
            className={`
              // Base styles for the navigation dot/pill
              relative cursor-pointer rounded-full
              transition-all duration-300 ease-out flex items-center

              // Dynamic height: expands to h-8 when hovered, otherwise stays as a 3px dot
              ${hoveredSection === id ? 'h-8' : 'h-[3px]'}

              // Dynamic width: expands to fit content when hovered, otherwise stays as a fixed w-8
              ${hoveredSection === id ? 'w-fit' : 'w-8'}

              // Background and border color logic with dark mode support:
              ${activeSection === id 
                ? hoveredSection === id 
                  ? 'bg-black dark:bg-white border border-gray-300 dark:border-gray-700' 
                  : 'bg-black dark:bg-white' 
                : 'bg-gray-300 dark:bg-gray-700'}
            `}
          >
            <span 
              ref={(el: HTMLSpanElement | null) => { labelRefs.current[id] = el }}
              className={`
                text-sm px-4
                ${hoveredSection === id ? 'block' : 'hidden'}
                ${activeSection === id && hoveredSection === id 
                  ? 'text-white dark:text-black' 
                  : 'text-gray-600 dark:text-gray-400'}
              `}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 