"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/shared/Button';

// Make sure ScrollTrigger is available on the client side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // State for hover image
  const [isHovering, setIsHovering] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  // Hover event handlers
  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setImagePosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 200 // Position image 200px above the text
      });
    }
    
    setIsHovering(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
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
  
  // Handle image animations
  useEffect(() => {
    if (typeof window === 'undefined' || !imageRef.current) return;
    
    if (isHovering) {
      gsap.fromTo(imageRef.current, 
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
    } else {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  }, [isHovering]);

  // Split text into words with spans
  const createWordSpans = (text: string) => {
    const words = text.split(' ');
    const nameWords = ['Ngatye', 'Brian', 'Oko.'];
    let nameGroup: JSX.Element[] = [];
    const spans: JSX.Element[] = [];
    let currentIndex = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isNameWord = nameWords.includes(word);
      
      if (isNameWord) {
        // Collect name words into a group
        nameGroup.push(
          <span 
            key={`name-${i}`} 
            className="word text-zinc-500 inline-block mr-[0.25em] leading-snug"
          >
            {word}
          </span>
        );
        
        // If this is the last name word, wrap the group
        if (word === 'Oko.') {
          spans.push(
            <span
              key={`name-group-${currentIndex}`}
              className="cursor-pointer hover:text-white transition-colors duration-200"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {nameGroup}
            </span>
          );
          nameGroup = [];
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
  const fullText = "Ngatye Brian Oko. AI‑designer. Builder. Storyteller. Born in the land of tapas, living in the city of Big Ben. Combining design strategy, UX/UI, and AI to ship products. 12+ years of experience in handing over impact to businesses, creating products that connect with people and deliver profitable results.";

  return (
    <div 
      ref={containerRef} 
      id="about" 
      className="py-32 md:py-40 min-h-screen flex items-center relative z-10"
    >
      {/* Hover Image */}
      <img
        ref={imageRef}
        src="https://res.cloudinary.com/da4fs4oyj/image/upload/v1767618022/about_animation_m3rzwe.png"
        alt="Ngatye Brian Oko"
        className="absolute pointer-events-none z-20 w-36 md:w-48 h-auto opacity-0"
        style={{
          left: `${imagePosition.x}px`,
          top: `${imagePosition.y}px`,
          transform: 'translateX(-50%)', // Center horizontally on the cursor
        }}
      />
      
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