"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/shared/Button';

// Hover groups configuration
type HoverGroup = {
  words: string[];
  image: string;
  id: string;
};

const hoverGroups: HoverGroup[] = [
  {
    id: 'name',
    words: ['Ngatye', 'Brian', 'Oko.'],
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1767618022/about_animation_m3rzwe.png'
  },
  {
    id: 'results',
    words: ['profitable', 'results.'],
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1767785314/fijx96ylpyeba23ybsvl.svg'
  }
];

// Make sure ScrollTrigger is available on the client side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Create refs for each hover group image and background
  const imageRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // State for hover images
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [imagePositions, setImagePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  
  // Hover event handlers
  const handleMouseEnter = useCallback((groupId: string) => (event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setImagePositions(prev => ({
        ...prev,
        [groupId]: {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 80 // Position image 80px above the text
        }
      }));
    }
    
    setActiveHover(groupId);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setActiveHover(null);
  }, []);

  useEffect(() => {
    // For server-side rendering safety
    if (typeof window === 'undefined') return;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    if (!textRef.current) return;
    
    // Get all word spans
    const words = textRef.current.querySelectorAll('.word');
    
    // Create a timeline for the animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.5,
        // markers: true, // Uncomment for debugging
      }
    });
    
    // Animate each word from grey to white
    words.forEach((word, index) => {
      tl.to(word, {
        color: 'white',
        duration: 0.5,
        ease: 'power2.out'
      }, index * 0.05); // Slight stagger for sequential reveal
    });
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Handle image animations for multiple hover targets
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Animate all images based on activeHover state
    hoverGroups.forEach(group => {
      const imageElement = imageRefs.current[group.id];
      const backgroundElement = imageRefs.current[`${group.id}-bg`];
      
      if (!imageElement) return;
      
      if (activeHover === group.id) {
        // Animate main image
        gsap.fromTo(imageElement, 
          {
            opacity: 0,
            scale: 0.8,
            y: 20
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          }
        );
        
        // Animate background if it exists (for SVG)
        if (backgroundElement) {
          gsap.fromTo(backgroundElement,
            {
              opacity: 0,
              scale: 0.6,
              y: 30
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.25,
              ease: 'power2.out'
            }
          );
        }
      } else {
        // Hide main image
        gsap.to(imageElement, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.2,
          ease: 'power2.in'
        });
        
        // Hide background if it exists
        if (backgroundElement) {
          gsap.to(backgroundElement, {
            opacity: 0,
            scale: 0.6,
            y: 30,
            duration: 0.15,
            ease: 'power2.in'
          });
        }
      }
    });
  }, [activeHover]);

  // Split text into words with spans
  const createWordSpans = (text: string) => {
    const words = text.split(' ');
    const spans: JSX.Element[] = [];
    let currentIndex = 0;
    
    // Create a map of word to hover group for faster lookup
    const wordToGroup = new Map<string, HoverGroup>();
    hoverGroups.forEach(group => {
      group.words.forEach(word => {
        wordToGroup.set(word, group);
      });
    });
    
    // Track active groups and their collected words
    const activeGroups = new Map<string, { words: JSX.Element[], startIndex: number }>();
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hoverGroup = wordToGroup.get(word);
      
      if (hoverGroup) {
        // Initialize group if not exists
        if (!activeGroups.has(hoverGroup.id)) {
          activeGroups.set(hoverGroup.id, { words: [], startIndex: currentIndex });
        }
        
        // Collect hover group words
        activeGroups.get(hoverGroup.id)!.words.push(
          <span 
            key={`${hoverGroup.id}-${i}`} 
            className="word text-zinc-500 inline-block mr-[0.25em] leading-snug"
          >
            {word}
          </span>
        );
        
        // If this is the last word in the group, wrap and add to spans
        if (word === hoverGroup.words[hoverGroup.words.length - 1]) {
          const groupData = activeGroups.get(hoverGroup.id)!;
          spans.push(
            <span
              key={`${hoverGroup.id}-group-${groupData.startIndex}`}
              className="cursor-pointer hover:text-white hover:font-semibold transition-all duration-200"
              onMouseEnter={handleMouseEnter(hoverGroup.id)}
              onMouseLeave={handleMouseLeave}
            >
              {groupData.words}
            </span>
          );
          activeGroups.delete(hoverGroup.id);
          currentIndex++;
        }
      } else {
        // Regular word
        spans.push(
          <span 
            key={currentIndex} 
            className="word text-zinc-500 inline-block mr-[0.25em] leading-snug"
          >
            {word}
          </span>
        );
        currentIndex++;
      }
    }
    
    return spans;
  };

  // Combine all paragraphs into a single text block
  const fullText = "Ngatye Brian Oko. AI‑designer. Builder. Storyteller. Born in the land of tapas, living in the city of Big Ben. I combine design strategy, UX/UI, and AI to ship products. 12+ years of experience in handing over impact to businesses, creating products that connect with people and deliver profitable results.";

  return (
    <div 
      ref={containerRef} 
      id="about" 
      className="py-32 md:py-40 min-h-screen flex items-center relative z-10"
    >
      {/* Hover Images */}
      {hoverGroups.map(group => {
        const position = imagePositions[group.id] || { x: 0, y: 0 };
        const isResults = group.id === 'results';
        
        return (
          <div key={group.id}>
            {/* Blurry white background for SVG */}
            {isResults && (
              <div
                ref={el => { imageRefs.current[`${group.id}-bg`] = el; }}
                className="absolute pointer-events-none bg-white opacity-0"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '260px',
                  height: '180px',
                  zIndex: 19
                }}
              />
            )}
            
            {/* Main hover image */}
            <img
              ref={el => { imageRefs.current[group.id] = el; }}
              src={group.image}
              alt={`Hover image for ${group.id}`}
              className={`absolute pointer-events-none w-36 md:w-48 h-auto opacity-0 ${isResults ? 'filter brightness-0' : ''}`}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
            />
          </div>
        );
      })}
      
      <div className="max-w-5xl mx-auto px-4">
        <div 
          ref={textRef}
          className="text-4xl md:text-5xl lg:text-6xl font-[200] tracking-normal leading-fluid-about"
        >
          {createWordSpans(fullText)}
        </div>
        
        <div className="mt-16">
          <Button
            asLink
            href="/cv"
            variant="primary-icon"
            size="md"
            icon={
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
            }
          >
            View my CV
          </Button>
        </div>
      </div>
    </div>
  );
} 