'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Define the props interface for the HomeProject component
interface HomeProjectProps {
  /**
   * Unique identifier for the project
   * This will be used for navigation and as the section ID
   */
  id: string;
  
  /**
   * Project title displayed in the sticky header
   */
  title: string;
  
  /**
   * Project tagline displayed in the sticky header
   */
  tagline: string;
  
  /**
   * Cover image URL
   */
  coverImage: string;
  
  /**
   * Label for the project category/type
   */
  label: string;
  
  /**
   * Array of project images to display
   */
  images: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
}

export function HomeProject({
  id,
  title,
  tagline,
  coverImage,
  label,
  images
}: HomeProjectProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  
  // Register this project section with NavigationProgress dynamically
  useEffect(() => {
    // This effect will run client-side only
    if (typeof window !== 'undefined') {
      // Try to access the sections array in NavigationProgress
      // This is a hacky way to dynamically add sections without modifying NavigationProgress
      try {
        // @ts-ignore - We're accessing a private variable
        const sectionsArray = window.__navigationSections || []
        const sectionExists = sectionsArray.some((section: any) => section.id === id)
        
        if (!sectionExists) {
          sectionsArray.push({ id, label: title })
          // @ts-ignore
          window.__navigationSections = sectionsArray
          
          // Dispatch an event to notify NavigationProgress of the change
          window.dispatchEvent(new CustomEvent('navigationSectionsUpdated', {
            detail: { sections: sectionsArray }
          }))
        }
      } catch (error) {
        console.error('Failed to register section with NavigationProgress:', error)
      }
    }
  }, [id, title])

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current || !coverRef.current) return
    
    // Create the sticky header effect
    const coverTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        endTrigger: sectionRef.current,
        end: "bottom bottom",
        pin: coverRef.current,
        pinSpacing: false,
        scrub: true,
      }
    })
    
    // Scale down the cover when reaching the first image
    coverTl.to(coverRef.current, {
      scale: 0.8,
      y: "-10vh",
      opacity: 0.3,
      scrollTrigger: {
        trigger: imagesRef.current[0] || sectionRef.current,
        start: "top center",
        scrub: true
      }
    })
    
    // Animate each image when it comes into view
    imagesRef.current.forEach((imageRef, index) => {
      if (!imageRef) return
      
      // Initial state - scaled down and transparent
      gsap.set(imageRef, { scale: 0.8, opacity: 0 })
      
      // Animation for each image
      gsap.to(imageRef, {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: imageRef,
          start: "top bottom",
          end: "center center",
          scrub: 1,
          toggleActions: "play none none reverse"
        }
      })
    })
    
    return () => {
      // Clean up by killing all ScrollTriggers for this component
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current || 
            trigger.vars.trigger === coverRef.current ||
            imagesRef.current.includes(trigger.vars.trigger as any)) {
          trigger.kill()
        }
      })
    }
  }, [])
  
  // Set refs for images
  const setImageRef = (index: number) => (el: HTMLDivElement | null) => {
    imagesRef.current[index] = el
  }

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className="min-h-screen relative overflow-hidden mb-32"
    >
      {/* Sticky project cover */}
      <div 
        ref={coverRef} 
        className="w-full h-screen flex flex-col justify-center items-start relative px-8"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-auto h-[90vh] relative aspect-[16/9]">
            <Image
              src={coverImage}
              alt={`${title} cover`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* Project label */}
        <div className="absolute top-8 left-8 bg-black text-white px-4 py-2 z-10">
          {label}
        </div>
        
        {/* Project content - left aligned with no background */}
        <div className="relative z-10 text-left text-white max-w-xl mt-auto mb-24">
          <h2 className="text-5xl font-bold mb-6">{title}</h2>
          <p className="text-2xl">{tagline}</p>
        </div>
      </div>
      
      {/* Project images */}
      <div className="container mx-auto px-4 py-24 space-y-32">
        {images.map((image, index) => (
          <div 
            key={index}
            ref={setImageRef(index)}
            className="w-full flex justify-center"
          >
            <div className="relative max-w-5xl w-full">
              <Image
                src={image.src}
                alt={image.alt || `${title} image ${index + 1}`}
                width={image.width || 1920}
                height={image.height || 1080}
                className="w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 