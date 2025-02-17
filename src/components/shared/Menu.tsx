'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const menuItems = [
  { label: 'Uniball Pen', path: '/uniball-pen' },
  { label: 'Cosmos', path: '/cosmos' },
  { label: 'M·A·C', path: '/mac' },
  { label: 'Beats by Dre.', path: '/beats' },
  { label: 'Salesforce', path: '/salesforce' },
  { label: 'Archive', path: '/archive' },
  { label: 'tonyzhao1947@gmail.com', path: '/contact' },
]

export function Menu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        toggleMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const items = itemsRef.current
    if (!items) return

    // Initial setup
    gsap.set(items, { 
      display: 'none',
      opacity: 0
    })

    gsap.set(itemRefs.current, {
      y: 20,
      opacity: 0
    })

    return () => {
      if (items) {
        gsap.killTweensOf([items, ...itemRefs.current])
      }
    }
  }, [])

  const toggleMenu = () => {
    const items = itemsRef.current
    if (!items) return

    if (!isOpen) {
      // Opening animation
      gsap.set(items, { display: 'flex' })
      
      // Fade in the container
      gsap.to(items, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Animate each item with stagger
      gsap.to(itemRefs.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out'
      })
    } else {
      // Closing animation
      gsap.to(itemRefs.current, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power3.in'
      })

      gsap.to(items, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(items, { display: 'none' })
        }
      })
    }

    setIsOpen(!isOpen)
  }

  return (
    <nav ref={menuRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div
        ref={itemsRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-3 min-w-[200px] px-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <button
            key={item.path}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            onClick={() => window.location.href = item.path}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              pathname === item.path
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-black/5 hover:text-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        onClick={toggleMenu}
        className="w-20 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
      >
        Menu
      </button>
    </nav>
  )
} 