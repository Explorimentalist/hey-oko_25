'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectProcess from '../ProjectProcess'

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
   * Year or timeframe shown in the metadata section
   */
  year?: string;
  
  /**
   * Role or responsibility summary
   */
  role?: string;
  
  /**
   * Impact or outcome statement
   */
  impact?: string;
  
  /**
   * Cover image URL
   */
  coverImage?: string;
  
  /**
   * Cover video embed URL (Loom/YouTube/etc)
   */
  coverVideo?: string;
  
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
  year,
  role,
  impact,
  coverImage,
  coverVideo,
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
  const projectYear = year || pillsLabel

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
            <div className="project-label flex flex-col justify-end gap-5 text-base text-white/80">
              {(projectYear || role) && (
                <div className="flex flex-col gap-2 text-white/80">
                  {projectYear && (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-white">Year:</span>
                      <span>{projectYear}</span>
                    </div>
                  )}
                  {role && (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-white">Role:</span>
                      <span>{role}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white">
                <span>Contribution:</span>
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
              {impact && (
                <div className="flex flex-wrap items-baseline gap-2 text-white">
                  <span>Impact / Outcome:</span>
                  <p className="text-white/80 leading-relaxed flex-1 min-w-0">
                    {impact}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Cover image section */}
        <div className="w-full flex justify-center">
          <div className={`w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] min-h-[60vh] sm:min-h-[70vh] md:min-h-[65vh] relative overflow-hidden bg-black project-cover-image ${
            id === 'project-epalwi-rebbo' 
              ? 'aspect-[1912/932]' 
              : 'aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9]'
          }`}>
            {coverVideo ? (
              coverVideo.endsWith('.mp4') || coverVideo.endsWith('.webm') ? (
                <video
                  src={coverVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <iframe
                  src={coverVideo}
                  title={`${title} cover video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-none border-0"
                />
              )
            ) : (
              coverImage && (
                <Image
                  src={coverImage}
                  alt={`${title} cover`}
                  fill
                  sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
                  className="object-cover object-center"
                  priority
                />
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Project Process Section */}
      {id !== 'project-3' && id !== 'project-4' && (
        <ProjectProcess 
          steps={
            id === 'project-epalwi-rebbo'
              ? [
                  {
                    id: 'step-epalwi-1',
                    title: 'Dictionary source review',
                    description: 'Validating the Spanish-Ndowe corpus and scanning the PDF dictionary to set the baseline.',
                    imageUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763414326/epalwi-rebbo_diccionario-pdf_sup7ld.png',
                  },
                  {
                    id: 'step-epalwi-2',
                    title: 'Data cleaning criteria',
                    description: 'Defining extraction rules, cleaning criteria, and schema alignment for structured entries.',
                    imageUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763392640/epalwi-rebbo_data-cleaning-criteria-gpt_mifn0i.png',
                  },
                  {
                    id: 'step-epalwi-3',
                    title: 'Component exploration',
                    description: 'Documenting interface components with motion tests to validate interactions for launch.',
                    imageUrl: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1763466884/epalwi-rebbo_components-video_ehnyhh.mp4',
                    imageWidth: 1920,
                    imageHeight: 1080,
                  },
                ]
              : id === 'project-aa'
                ? [
                    {
                      id: "step-1",
                      title: "Heuristic Evaluation & Workshop",
                      description: "We pointed the UI/UX flaws and Requirements in the sign up, perks and booking flows.",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_workshop_results-large_pzl7a6.png"
                    },
                    {
                      id: "step-2",
                      title: "Ideation", 
                      description: "Sketching flows for guided sign up, visible AA perks and quicker breakdown booking.",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_sketches-large_xsyk2v.png"
                    },
                    {
                      id: "step-3",
                      title: "Testing",
                      description: "We selected the concepts winning concepts through A/B testing",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1763478892/aa-test-large_hhyhst.png"
                    },
                    {
                      id: "step-5",
                      title: "Solution",
                      description: "1. Designed an onboarding and added tooltips\n\n2. Incorporates a list of perks on the map view\n\n3. Transformed a tree selection into a max of 2 selection",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_before-after_tt5vzr.gif"
                    }
                  ]
              : id === 'project-1'
                ? [
                    {
                      id: "step-2",
                      title: "Ideation & Conceptualization", 
                      description: "Brainstorming solutions, sketching ideas, and developing the core concept through collaborative workshops.",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1763485407/maserati_mapping-process_hfzqnq.png"
                    },
                    {
                      id: "step-3",
                      title: "Design & Prototyping",
                      description: "Creating wireframes, high-fidelity designs, and interactive prototypes to validate the user experience.",
                      imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/ivjmizltxj0umvmg9adm.png"
                    }
                  ]
              : [
                  {
                    id: "step-1",
                    title: "Research & Discovery",
                    description: "Deep diving into user needs, market research, and competitive analysis to understand the problem space.",
                    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_workshop_results-large_pzl7a6.png"
                  },
                  {
                    id: "step-2",
                    title: "Ideation & Conceptualization", 
                    description: "Brainstorming solutions, sketching ideas, and developing the core concept through collaborative workshops.",
                    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_sketches-large_xsyk2v.png"
                  },
                  {
                    id: "step-3",
                    title: "Design & Prototyping",
                    description: "Creating wireframes, high-fidelity designs, and interactive prototypes to validate the user experience.",
                    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/ivjmizltxj0umvmg9adm.png"
                  },
                  {
                    id: "step-4", 
                    title: "Development & Implementation",
                    description: "Building the solution with attention to detail, performance optimization, and accessibility standards.",
                    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/Amplify_g1lq1q.png"
                  },
                  {
                    id: "step-5",
                    title: "Testing & Refinement",
                    description: "User testing, gathering feedback, and iterating on the design to ensure optimal user experience.",
                    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_before-after_tt5vzr.gif"
                  }
                ]
          }
        />
      )}
      
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
