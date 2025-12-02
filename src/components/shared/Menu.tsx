'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Button } from './Button'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin)
}

const menuItems = [
  { label: 'Welcome', path: '#hero-sequence-container' },
  { label: 'About', path: '#about' },
  { label: 'Epàlwi-Rebbó', path: '#project-epalwi-rebbo' },
  { label: 'AA (The Automobile Association)', path: '#project-aa' },
  { label: 'AET', path: '#project-aet' },
  { label: 'Ngatye@hey-oko.com', path: 'mailto:Ngatye@hey-oko.com' },
]

export function Menu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([])

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

  const handleItemClick = (path: string) => {
    // Close the menu
    toggleMenu()

    // Hash links: scroll precisely to visual content
    if (path.startsWith('#')) {
      const id = path.slice(1)

      // Default to the element by id
      let target: string | Element = path
      let offsetY = 0

      // For project sections, aim at the cover/image block for better alignment
      if (id.startsWith('project')) {
        const section = document.getElementById(id)
        const cover = section?.querySelector('.project-cover-image') as Element | null
        if (cover) {
          target = cover
        } else if (section) {
          target = section
          // Slight nudge to account for internal padding if cover not found
          offsetY =  -16
        }
      }

      // Smooth scroll
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY },
        ease: 'power2.inOut'
      })
    } else {
      // Navigate to a different page or mailto
      window.location.href = path
    }
  }

  return (
    <nav 
      ref={menuRef} 
      className={"fixed left-1/2 -translate-x-1/2 bottom-8 z-40 md:hidden"}
    >
      <div
        ref={itemsRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-4 w-[min(400px,calc(100vw-2rem))] px-5 py-4 bg-zinc/80 backdrop-blur-md rounded-2xl overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <Button
            key={item.path}
            ref={(el) => {
              itemRefs.current[index] = el
            }}  
            onClick={() => handleItemClick(item.path)}
            variant={pathname === item.path ? 'primary' : 'tertiary'}
            size="md"
            className={pathname === item.path ? 'bg-white text-black' : ''}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <Button
        onClick={toggleMenu}
        variant="secondary"
        size="md"
        className="w-20 h-10"
      >
        Menu
      </Button>
    </nav>
  )
} 
