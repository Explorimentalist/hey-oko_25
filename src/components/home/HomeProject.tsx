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
   * Project description displayed below the title
   */
  description?: string;
  
  /**
   * Label text displayed above the pills
   */
  pillsLabel?: string;
  
  /**
   * Cover image URL
   */
  coverImage: string;
  
  /**
   * Labels for the project categories/types
   * Can be a single string or an array of strings
   */
  label: string | string[];
  
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
  description,
  pillsLabel,
  coverImage,
  label,
  images
}: HomeProjectProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const [isActive, setIsActive] = useState(false)
  
  // Register this project section with NavigationProgress dynamically
  useEffect(() => {
    // This effect will run client-side only
    if (typeof window === 'undefined') return
    
    // Try to access the sections array in NavigationProgress
    // This is a hacky way to dynamically add sections without modifying NavigationProgress
    try {
      // @ts-ignore - We're accessing a private variable
      const sectionsArray = window.__navigationSections || []
      const sectionExists = sectionsArray.some((section: any) => section.id === id)
      
      if (!sectionExists) {
        // Use the original title for navigation
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
  }, [id, title])

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current || !coverRef.current) return
    
    // Get all elements that need to be animated
    const coverImage = coverRef.current.querySelector('.project-cover-image')
    const projectTitle = coverRef.current.querySelector('.project-title')
    const projectLabel = coverRef.current.querySelector('.project-label')
    const textElements = [projectTitle, projectLabel]
    
    // Set initial states for entrance animation
    gsap.set([coverImage, ...textElements], {
      opacity: 0,
      y: 30,
      force3D: true,
    })
    
    // Create timeline for entrance animation
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom-=20%",
        end: "top center",
        scrub: 1,
        onEnter: () => {
          setIsActive(true)
        },
        onLeaveBack: () => {
          setIsActive(false)
        }
      }
    })
    
    // Add animations to entrance timeline - staggered entrance
    entranceTl
      .to(projectTitle, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      }, 0)
      .to(projectLabel, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      }, 0.1) // Slight stagger
      .to(coverImage, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        force3D: true,
      }, 0.2) // Cover image comes in last
    
    // Animate each image when it comes into view
    imagesRef.current.forEach((imageRef, index) => {
      if (!imageRef) return
      
      // Initial state - scaled down and transparent
      gsap.set(imageRef, { scale: 0.8, opacity: 0 })
      
      // Animation for each image with smoother transitions
      gsap.to(imageRef, {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: imageRef,
          start: "top bottom",
          end: "center center",
          scrub: 1.5, // Increased for smoother scrolling
          toggleActions: "play none none reverse"
        },
        ease: "power1.inOut", // Added ease parameter
        duration: 1.2 // Added explicit duration
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
  }, [id, isActive]) // Added id and isActive to dependencies
  
  // Set refs for images
  const setImageRef = (index: number) => (el: HTMLDivElement | null) => {
    imagesRef.current[index] = el
  }

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className="min-h-screen relative overflow-hidden mb-[40vh] md:mb-[50vh] lg:mb-[70vh]" // Responsive bottom margin
    >
      {/* Project content above cover */}
      <div 
        ref={coverRef} 
        className="w-full min-h-screen flex flex-col justify-start relative px-4 sm:px-6 md:px-8 py-8 md:py-12"
      >
        {/* Text content section */}
        <div className="w-full max-w-7xl mx-auto mb-8 md:mb-12 lg:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 md:items-end">
            {/* Project title and description - half width on desktop/tablet, full width on mobile */}
            <div className="project-title">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white max-w-2xl mb-4">
                {title}
              </h2>
              {description && (
                <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* Project labels - half width on desktop/tablet, full width on mobile */}
            <div className="project-label flex flex-col justify-end">
              {pillsLabel && (
                <p className="text-white/60 text-sm md:text-base mb-3">
                  {pillsLabel}
                </p>
              )}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {Array.isArray(label) ? (
                  label.map((labelText, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full pill-text-xs"
                    >
                      {labelText}
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full pill-text-xs">
                    {label}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cover image section */}
        <div className="w-full flex justify-center">
          <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] min-h-[60vh] sm:min-h-[70vh] md:min-h-[65vh] aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] relative project-cover-image">
            <Image
              src={coverImage}
              alt={`${title} cover`}
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Project images */}
      <div className="container mx-auto px-4 py-12 md:py-18 lg:py-24 space-y-24 md:space-y-36 lg:space-y-48">
        {images.map((image, index) => {
          const isVideo = image.src.endsWith('.mp4') || image.src.endsWith('.webm');
          
          return (
            <div 
              key={index}
              ref={setImageRef(index)}
              className="w-full flex justify-center"
            >
              <div className="relative max-w-5xl flex justify-center">
                {isVideo ? (
                  <video
                    src={image.src}
                    autoPlay={true}
                    loop
                    muted
                    playsInline
                    className="max-w-full h-auto"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt || `${title} image ${index + 1}`}
                    width={image.width || 1920}
                    height={image.height || 1080}
                    className="object-contain"
                    style={{ 
                      maxWidth: '100%', 
                      width: 'auto',
                      height: 'auto'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
} 