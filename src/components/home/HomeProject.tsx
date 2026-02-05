'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '../shared/Button'
import { Process } from './Process'
import { ImpactList } from '../project/ImpactList'
import CollaborationDetails from './CollaborationDetails'
import { processSlidesByProject } from '@/data/processSlides'

gsap.registerPlugin(ScrollTrigger)

// Fullscreen overlay for the AET demo iframe
function AETDemoOverlay({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AET interactive demo"
    >
      <Button
        type="button"
        onClick={onClose}
        variant="primary"
        size="sm"
        className="absolute right-5 top-5 z-[10000]"
        aria-label="Close AET demo"
      >
        Close
      </Button>
      <div className="relative w-full max-w-6xl h-[calc(100vh-5rem)] md:aspect-[16/10] md:h-auto rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black">
        <iframe
          src="https://aet-ski.vercel.app/product-demo/embed"
          className="absolute inset-0 h-full w-full"
          allow="clipboard-write; fullscreen"
          title="AET Ski Transfers Demo"
        />
      </div>
    </div>
  )
}

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
   * Array of impact item indices (0-based) that should use up arrow animation
   */
  impactUpArrowIndices?: number[];

  /**
   * Array of impact item indices (0-based) that should use sparkles animation
   */
  impactSparklesIndices?: number[];

  /**
   * Array of impact item indices (0-based) that should use target animation
   */
  impactTargetIndices?: number[];

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

  /**
   * Custom collaboration data for the modal
   */
  collaborationData?: {
    teamInvolvement?: string[];
    rituals?: string[];
    communicationChannels?: string[];
    keyActivities?: string[];
    myImpact?: string[];
  };

  /**
   * Team roles for the collaboration details
   */
  teamRoles?: Array<{ id: string; role: string }>;
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
  impactUpArrowIndices,
  impactSparklesIndices,
  impactTargetIndices,
  coverImage,
  coverVideo,
  label,
  images,
  collaborationData,
  teamRoles
}: HomeProjectProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const [isActive, setIsActive] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  
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
  const processSlides = processSlidesByProject[id] || []

  return (
    <article className="mb-[15vh] md:mb-[50vh] lg:mb-[70vh]">
      <AETDemoOverlay
        isOpen={id === 'project-aet' && isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
      <section 
        ref={sectionRef}
        id={id} 
        className="min-h-screen relative overflow-hidden"
      >
        {/* Project content above cover */}
        <div 
          ref={coverRef} 
          className="w-full min-h-screen flex flex-col justify-start relative px-4 sm:px-6 md:px-8 py-8 md:py-12"
        >
          {/* Text content section */}
          <div className="w-full mb-8 md:mb-12 lg:mb-16">
            <div className="project-title">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
                {title}
              </h2>
              {tagline && (
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                  {tagline}
                </p>
              )}
            </div>
          </div>
          
          {/* Cover image section */}
          <div className="w-full flex justify-center">
            <div className={`w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] sm:min-h-[70vh] md:min-h-[65vh] relative overflow-hidden bg-black project-cover-image ${
              id === 'project-epalwi-rebbo' 
                ? 'aspect-[1912/932]' 
                : 'aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/9]'
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
                    className="object-contain object-center"
                    priority
                  />
                )
              )}
            </div>
          </div>

          {(projectYear || role || label || impact) && (
            <div className="project-label w-full mt-6">
              <div className="grid grid-cols-4 gap-y-10 gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12 lg:gap-x-4">
                {(role || projectYear || label) && (
                  <div className="col-span-2 md:col-span-4 lg:col-span-3 lg:col-start-1 lg:row-start-1 flex flex-col gap-6 text-white">
                    {role && (
                      <div className="space-y-1">
                        <p className="text-small tracking-wide text-white/60">Role</p>
                        <p className="text-small leading-relaxed">{role}</p>
                      </div>
                    )}
                    {projectYear && (
                      <div className="space-y-1">
                        <p className="text-small tracking-wide text-white/60">Year</p>
                        <p className="text-small leading-relaxed">{projectYear}</p>
                      </div>
                    )}
                    {label && (
                      <div className="hidden lg:block">
                        <CollaborationDetails
                          teamRoles={
                            teamRoles || [
                              { id: 'pm', role: 'PM' },
                              { id: 'dev', role: 'Dev' },
                              { id: 'ui', role: 'UI' },
                              { id: 'client', role: 'Client' },
                            ]
                          }
                          collaborationData={{
                            teamInvolvement: collaborationData?.teamInvolvement || (Array.isArray(label) ? label : [label]),
                            rituals: collaborationData?.rituals || [
                              'Weekly design reviews',
                              'Daily async updates',
                              'Bi-weekly planning sessions',
                            ],
                            communicationChannels: collaborationData?.communicationChannels || [
                              'Slack',
                              'Figma & FigJam',
                              'Google Drive',
                            ],
                            keyActivities: collaborationData?.keyActivities || [
                              'Design sprints & exploration',
                              'Prototyping & user testing',
                              'Iteration based on feedback',
                              'Final handoff & documentation',
                            ],
                            myImpact: collaborationData?.myImpact || [
                              'Led end-to-end design execution',
                              'Established design patterns for scalability',
                              'Improved team collaboration workflow',
                            ],
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {label && (
                  <div className="col-span-2 md:col-span-4 lg:hidden">
                    <CollaborationDetails
                      teamRoles={
                        teamRoles || [
                          { id: 'pm', role: 'PM' },
                          { id: 'dev', role: 'Dev' },
                          { id: 'ui', role: 'UI' },
                          { id: 'client', role: 'Client' },
                        ]
                      }
                      collaborationData={{
                        teamInvolvement: collaborationData?.teamInvolvement || (Array.isArray(label) ? label : [label]),
                        rituals: collaborationData?.rituals || [
                          'Weekly design reviews',
                          'Daily async updates',
                          'Bi-weekly planning sessions',
                        ],
                        communicationChannels: collaborationData?.communicationChannels || [
                          'Slack',
                          'Figma & FigJam',
                          'Google Drive',
                        ],
                        keyActivities: collaborationData?.keyActivities || [
                          'Design sprints & exploration',
                          'Prototyping & user testing',
                          'Iteration based on feedback',
                          'Final handoff & documentation',
                        ],
                        myImpact: collaborationData?.myImpact || [
                          'Led end-to-end design execution',
                          'Established design patterns for scalability',
                          'Improved team collaboration workflow',
                        ],
                      }}
                    />
                  </div>
                )}

                {impact && (
                  <div className="col-span-4 md:col-span-6 md:col-start-1 lg:col-span-7 lg:col-start-5 lg:row-start-1">
                    <ImpactList items={impact} upArrowIndices={impactUpArrowIndices} sparklesIndices={impactSparklesIndices} targetIndices={impactTargetIndices} />
                  </div>
                )}
              </div>
            </div>
          )}

          {description && (
            <div className="w-full mt-12 md:mt-16 lg:mt-[84px]">
              <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-y-6 gap-x-4">
                <div className="col-span-12 md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-5">
                  <p className="text-base text-white/70 tracking-wide">The problem</p>
                  <p className="text-h5 text-white mt-4 leading-relaxed font-light">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {processSlides.length > 0 && (
        <div className="container mx-auto px-4 mt-12 md:mt-16 lg:mt-20">
          <Process slides={processSlides} />
        </div>
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
        
        {/* AET Project Demo Iframe */}
        {id === 'project-aet' && (
          <div 
            className="relative flex flex-col items-center gap-3 text-center p-12 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/da4fs4oyj/image/upload/v1764601787/aet_demo-background_rkk3yo.png')",
              backgroundPosition: 'center bottom'
            }}
          >
            <div className="flex-1 flex items-end pb-12">
              <div className="relative inline-flex">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-2xl bg-zinc/80 backdrop-blur-md"
                />
                <Button
                  type="button"
                  onClick={() => setIsDemoOpen(true)}
                  variant="primary-icon-left"
                  size="sm"
                  className="relative z-10"
                  icon={
                    <svg 
                      className="w-4 h-4" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        d="M8 5v14l11-7z" 
                      />
                    </svg>
                  }
                >
                  Play demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
} 
