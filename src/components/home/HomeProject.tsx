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
    
    // Create the sticky header effect with improved end point
    const coverTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        endTrigger: sectionRef.current,
        end: "bottom-=30% bottom", // End earlier to prevent overlap
        pin: coverRef.current,
        pinSpacing: false,
        scrub: 0.8,
        onEnter: () => {
          setIsActive(true)
        },
        onLeaveBack: () => {
          setIsActive(false)
        }
      }
    })
    
    // Set initial states
    gsap.set(coverImage, {
      scale: 0.9,
      opacity: 0.9,
      force3D: true, // Enable hardware acceleration
      transformOrigin: "center center"
    })
    
    gsap.set(textElements, {
      opacity: 0.9,
    })
    
    // Create timeline for entrance animation
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom-=20%",
        end: "top center+=15%",
        scrub: 1,
      }
    })
    
    // Add animations to entrance timeline
    entranceTl
      .to(coverImage, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        force3D: true, // Enable hardware acceleration
      }, 0)
      .to(textElements, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      }, 0) // Start at the same time as the cover image animation
    
    // Create timeline for exit animation with improved visibility handling
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: imagesRef.current[0] || sectionRef.current,
        start: "top bottom-=25%", // Start exit animation earlier
        end: "top center+=15%", // Extended end point for smoother transition
        scrub: 1.5, // Increase scrub for smoother animation
      }
    })
    
    // Add animations to exit timeline with smoother transitions
    exitTl
      .to(coverImage, {
        scale: 0.9, // More consistent with entrance scale
        y: "-10vh", // Less extreme movement
        opacity: 0,
        duration: 1.8, // Longer, smoother fade-out
        ease: "power3.inOut", // Better easing function for size changes
        force3D: true, // Enable hardware acceleration
      }, 0)
      .to(textElements, {
        opacity: 0,
        duration: 1.5, // Longer fade-out for text
        ease: "power3.inOut",
      }, 0) // Start at the same time as the cover image animation
    
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
      {/* Sticky project cover */}
      <div 
        ref={coverRef} 
        className="w-full h-screen flex flex-col justify-center items-start relative px-4 sm:px-6 md:px-8"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] min-h-[80vh] sm:min-h-[70vh] md:min-h-[65vh] aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] relative project-cover-image">
            <Image
              src={coverImage}
              alt={`${title} cover`}
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
              className="object-cover object-center"
              priority
            />
            
            {/* Project labels - positioned bottom right inside the cover image */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 flex flex-wrap gap-1 sm:gap-2 justify-end z-10 project-label transition-all duration-1000 ease-out">
              {Array.isArray(label) ? (
                label.map((labelText, index) => (
                  <div 
                    key={index} 
                    className="bg-black/30 backdrop-blur-sm text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-small uppercase tracking-wider"
                  >
                    {labelText}
                  </div>
                ))
              ) : (
                <div className="bg-black/30 backdrop-blur-sm text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-small uppercase tracking-wider">
                  {label}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Project title - positioned on the left */}
        <div className="absolute inset-0 flex items-center justify-start pl-6 sm:pl-12 md:pl-24 lg:pl-32 z-10 project-title transition-all duration-1000 ease-out">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white max-w-2xl text-shadow-md">{title}</h2>
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