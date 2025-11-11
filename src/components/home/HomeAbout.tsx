"use client";

import { useEffect, useRef } from 'react';
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

  // Split text into words with spans
  const createWordSpans = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="word text-zinc-500 inline-block mr-[0.25em] leading-snug">
        {word}
      </span>
    ));
  };

  // Combine all paragraphs into a single text block
  const fullText = "I'm Ngatye Brian Oko, a branch of the African tree, born in the land of tapas, living in the city of Big Ben. I have over a decade experience shaping digital products with curiosity and a holistic edge. I work at the intersection of UX/UI, Futures Thinking, and AI technology, helping businesses become more human, more profitable, and hard to ignore.";

  return (
    <div 
      ref={containerRef} 
      id="about" 
      className="py-32 md:py-40 min-h-screen flex items-center relative z-10"
    >
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