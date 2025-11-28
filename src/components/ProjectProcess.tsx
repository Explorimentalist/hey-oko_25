"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type ProjectStep = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
};

interface ProjectProcessProps {
  steps: ProjectStep[];
  startTriggerRef?: React.RefObject<HTMLElement>;
  startPosition?: string;
}

type StepDimensions = {
  width: number;
  height: number;
};

const isVideoUrl = (url: string) => url.endsWith('.mp4') || url.endsWith('.webm');

const DEFAULT_DIMENSIONS: StepDimensions = {
  width: 480,
  height: 640,
};

const centeredPosition: React.CSSProperties = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default function ProjectProcess({ steps, startTriggerRef, startPosition = 'top top' }: ProjectProcessProps) {
  const stepsKey = useMemo(() => JSON.stringify(steps), [steps]);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const requestedDimensionsRef = useRef<Set<string>>(new Set());
  const [dynamicDimensions, setDynamicDimensions] = useState<Record<string, StepDimensions>>({});
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const slidesCount = Math.max(steps.length, 1);

  useEffect(() => {
    let isMounted = true;
    const preloadImages: HTMLImageElement[] = [];

    steps.forEach(step => {
      if (isVideoUrl(step.imageUrl)) {
        // Skip image preloading/dimension measurement for videos; they use provided/default dimensions
        return;
      }
      const needsDimensions = step.imageWidth == null || step.imageHeight == null;
      const alreadyRequested = requestedDimensionsRef.current.has(step.id);

      if (!needsDimensions || alreadyRequested) return;

      requestedDimensionsRef.current.add(step.id);

      const img = new Image();
      preloadImages.push(img);
      img.src = step.imageUrl;

      const storeDimensions = (width?: number, height?: number) => {
        if (!isMounted) return;
        setDynamicDimensions(prev => {
          if (prev[step.id]) return prev;
          return {
            ...prev,
            [step.id]: {
              width: width || DEFAULT_DIMENSIONS.width,
              height: height || DEFAULT_DIMENSIONS.height,
            },
          };
        });
      };

      img.onload = () => storeDimensions(img.naturalWidth, img.naturalHeight);
      img.onerror = () => storeDimensions();
    });

    return () => {
      isMounted = false;
      preloadImages.forEach(image => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [stepsKey, startTriggerRef]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Ensure we have the latest value if the component mounted during SSR hydration.
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const dimensionMap = useMemo<Record<string, StepDimensions>>(() => {
    return steps.reduce<Record<string, StepDimensions>>((acc, step) => {
      const dynamic = dynamicDimensions[step.id];
      acc[step.id] = {
        width: step.imageWidth ?? dynamic?.width ?? DEFAULT_DIMENSIONS.width,
        height: step.imageHeight ?? dynamic?.height ?? DEFAULT_DIMENSIONS.height,
      };
      return acc;
    }, {});
  }, [stepsKey, dynamicDimensions]);

  const constrainedDimensions = useMemo<Record<string, StepDimensions>>(() => {
    const maxDisplayHeight = viewportHeight > 0 ? viewportHeight * 0.8 : Infinity;
    const maxDisplayWidth = viewportWidth > 0 ? viewportWidth * 0.9 : Infinity;

    return steps.reduce<Record<string, StepDimensions>>((acc, step) => {
      const base = dimensionMap[step.id] ?? DEFAULT_DIMENSIONS;

      // Calculate scale factors for both height and width constraints
      const heightScale = base.height > maxDisplayHeight ? maxDisplayHeight / base.height : 1;
      const widthScale = base.width > maxDisplayWidth ? maxDisplayWidth / base.width : 1;
      
      // Use the smaller scale factor to ensure image fits within both constraints
      const scale = Math.min(heightScale, widthScale);

      acc[step.id] = {
        width: Math.round(base.width * scale),
        height: Math.round(base.height * scale),
      };

      return acc;
    }, {});
  }, [stepsKey, dimensionMap, viewportHeight, viewportWidth]);

  const constrainedDimensionsRef = useRef<Record<string, StepDimensions>>({});
  constrainedDimensionsRef.current = constrainedDimensions;

  const sectionHeight = useMemo(() => {
    // Add extra scroll room so the sticky viewport can animate all steps
    return `${Math.max(slidesCount + 1, 2) * 100}vh`;
  }, [slidesCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [constrainedDimensions]);

  // Helper function to set description with line breaks
  const setDescriptionContent = (element: HTMLElement, text: string) => {
    element.innerHTML = '';
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        // Empty line - add spacing
        const br = document.createElement('br');
        element.appendChild(br);
      } else {
        // Non-empty line
        const p = document.createElement('p');
        p.textContent = line;
        if (index < lines.length - 1 && lines[index + 1].trim() !== '') {
          p.style.marginBottom = '0.25rem'; // Small spacing between lines
        }
        element.appendChild(p);
      }
    });
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const stepsWrapper = stepsWrapperRef.current;
    const line = lineRef.current;
    const textContainer = textRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const scrollSection = scrollSectionRef.current;

    const triggerElement = startTriggerRef?.current ?? scrollSection ?? container;

    if (!container || !stepsWrapper || !line || !textContainer || !title || !description || !triggerElement || steps.length === 0) return;

    const getConstrainedStep = (stepId: string) =>
      constrainedDimensionsRef.current[stepId] ?? DEFAULT_DIMENSIONS;

    // Set initial state for the line (starts with 0 width)
    gsap.set(line, { width: '0%' });

    // Set initial states for all steps
    stepsRefs.current.forEach((stepRef, index) => {
      if (!stepRef) return;
      
      const imageWrapper = stepRef.querySelector('.step-image-wrapper') as HTMLElement;
      
      if (imageWrapper) {
        // Initial state: wrapper height starts at line thickness (1px) and opacity 0
        gsap.set(imageWrapper, { height: '1px', opacity: 0 });
        
        const image = imageWrapper.querySelector('.step-image') as HTMLElement;
        if (image) {
          // Initial scale for the image
          gsap.set(image, { scale: 0.8, clipPath: 'inset(100% 0% 0% 0%)' });
        }
      }
    });

    // Set initial text content and state
    title.textContent = steps[0].title;
    setDescriptionContent(description, steps[0].description);
    gsap.set(textContainer, { y: 50, opacity: 0 });

    // Create separate timeline for first step animations (line, text, image) triggered by scroll but running independently
    const firstStepTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top bottom',
        end: 'top top',
        toggleActions: 'play none none reverse'
      }
    });

    // Staggered animations: line first, then text, then first image
    firstStepTimeline.to(line, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.out'
    }, 0);

    // Text animation starts after line begins
    firstStepTimeline.to(textContainer, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.2);

    // First image animation starts after text begins
    const firstStepRef = stepsRefs.current[0];
    if (firstStepRef && steps.length > 0) {
      const firstImageWrapper = firstStepRef.querySelector('.step-image-wrapper') as HTMLElement;
      
      if (firstImageWrapper) {
        const firstImage = firstImageWrapper.querySelector('.step-image') as HTMLElement;
        const resolveFirstHeight = () => `${getConstrainedStep(steps[0].id).height}px`;
        
        // Image wrapper height and opacity animation
        firstStepTimeline.to(firstImageWrapper, {
          height: resolveFirstHeight,
          duration: 0.5,
          ease: 'power2.out',
          invalidateOnRefresh: true
        }, 0.4);
        
        firstStepTimeline.to(firstImageWrapper, {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out'
        }, 0.4);
        
        // Image scale and clipPath animation
        if (firstImage) {
          firstStepTimeline.to(firstImage, {
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.5,
            ease: 'power2.out'
          }, 0.4);
        }
      }
    }

    // Create the main timeline for scroll-controlled animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: startPosition,
        end: () => {
          const vh = viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 1);
          return `+=${Math.max(slidesCount, 1) * vh}`;
        },
        scrub: 1,
      }
    });

    // Animate the horizontal scroll
    tl.to(stepsWrapper, {
      x: () => -(steps.length - 1) * window.innerWidth,
      ease: 'none',
      duration: steps.length
    });

    // Skip first step since it's handled by independent timeline

    // Create individual step animations (skip first step since it's handled independently)
    stepsRefs.current.forEach((stepRef, index) => {
      if (!stepRef || index === 0) return; // Skip first step

      const imageWrapper = stepRef.querySelector('.step-image-wrapper') as HTMLElement;

      if (imageWrapper) {
        const image = imageWrapper.querySelector('.step-image') as HTMLElement;
        const resolveStepHeight = () => `${getConstrainedStep(steps[index].id).height}px`;
        
        // Align with horizontal scroll progression: each step gets 1 duration unit
        const animationTime = index;
        
        // Image reveals from the bottom by growing height and fading in
        tl.to(imageWrapper, {
          height: resolveStepHeight,
          duration: 0.5,
          ease: 'power2.out',
          invalidateOnRefresh: true
        }, animationTime);
        
        // Fade in animation with half the duration of the reveal
        tl.to(imageWrapper, {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out'
        }, animationTime);
        
        // Scale animation from 0.8 to 1.0 simultaneously with reveal
        if (image) {
          tl.to(image, {
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.5,
            ease: 'power2.out'
          }, animationTime);
        }

        // Add exit animation for all images except the last
        if (index < steps.length - 1) {
          const exitTime = (index + 1) - 0.2;
          
          // Fade out
          tl.to(imageWrapper, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in'
          }, exitTime);
          
          // Height collapse
          tl.to(imageWrapper, {
            height: '1px',
            duration: 0.4,
            ease: 'power2.in'
          }, exitTime);
          
          // Scale back down during exit
          if (image) {
            tl.to(image, {
              scale: 0.8,
              clipPath: 'inset(100% 0% 0% 0%)',
              duration: 0.4,
              ease: 'power2.in'
            }, exitTime);
          }
        }
      }
    });

    // Create text change animations separately for better timing control
    for (let i = 0; i < steps.length - 1; i++) {
      const changeTime = (i + 1) - 0.15;
      
      // Fade out current text
      tl.to(textContainer, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in'
      }, changeTime);

      // Change content and set new text position below
      tl.call(() => {
        if (title && description) {
          title.textContent = steps[i + 1].title;
          setDescriptionContent(description, steps[i + 1].description);
        }
        // Position new text 16px below its final position
        gsap.set(textContainer, { y: 16 });
      }, [], changeTime + 0.15);

      // Slide up and fade in new text simultaneously
      tl.to(textContainer, {
        y: 0,
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
      }, changeTime + 0.15);
    }

    ScrollTrigger.refresh();

    return () => {
      firstStepTimeline.kill();
      tl.kill();
      
      // Clean up any orphaned ScrollTriggers specifically for this container
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container || trigger.vars.trigger === triggerElement) {
          trigger.kill();
        }
      });
    };
  }, [stepsKey, startPosition, startTriggerRef, viewportHeight, slidesCount]);

  return (
    <div 
      ref={containerRef}
      className="relative w-screen"
      style={{ height: sectionHeight }}
    >
      <div 
        ref={scrollSectionRef}
        className="w-screen h-screen bg-zinc-950 relative overflow-hidden sticky top-0"
      >
        {/* Horizontal line at center (50% height) - Hidden */}
        <div 
          ref={lineRef}
          className="absolute left-0 bg-white opacity-0"
          style={{ 
            top: '50%', 
            height: '1px',
            border: 'none',
            width: '0%'
          }}
        />

        {/* Steps wrapper for horizontal scroll */}
        <div 
          ref={stepsWrapperRef}
          className="flex h-full"
          style={{ width: `${steps.length * 100}vw` }}
        >
          {steps.map((step, index) => {
            // Fall back to measured (or default) sizes when explicit dimensions aren't provided.
            const resolvedDimensions = constrainedDimensions[step.id] ?? DEFAULT_DIMENSIONS;

            return (
              <div
                key={step.id}
                ref={el => { stepsRefs.current[index] = el }}
                className="w-screen h-full flex flex-col items-center justify-center relative"
              >
                {/* Image container always centered on the line */}
                <div 
                  className="step-image-wrapper absolute overflow-hidden h-px"
                  style={{
                    ...centeredPosition,
                    width: `${resolvedDimensions.width}px`,
                  }}
                >
                  {isVideoUrl(step.imageUrl) ? (
                    <video
                      src={step.imageUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="step-image object-cover absolute"
                      style={{ 
                        ...centeredPosition,
                        width: `${resolvedDimensions.width}px`,
                        height: `${resolvedDimensions.height}px`,
                      }}
                    />
                  ) : (
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="step-image object-cover absolute"
                      style={{ 
                        ...centeredPosition,
                        width: `${resolvedDimensions.width}px`,
                        height: `${resolvedDimensions.height}px`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed text positioned at bottom left */}
        <div 
          ref={textRef}
          className="absolute bottom-4 left-4 md:bottom-16 md:left-16 flex flex-col gap-2 px-3 py-3 md:px-5 md:py-4 bg-zinc/90 backdrop-blur-md rounded-2xl max-w-[calc(100vw-2rem)] md:max-w-none"
          style={{ 
            width: 'min(298px, calc(100vw - 2rem))'
          }}
        >
          <h3 
            ref={titleRef}
            className="text-white font-medium text-h5"
          />
          <div 
            ref={descriptionRef}
            className="text-white font-light tracking-wider text-small"
          />
        </div>
      </div>
    </div>
  );
}
