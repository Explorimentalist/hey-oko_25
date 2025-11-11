"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/shared/Button';

interface CVDownloadButtonProps {
  headingId: string;
}

export function CVDownloadButton({ headingId }: CVDownloadButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [mobileTop, setMobileTop] = useState(80);

  const updatePosition = useCallback(() => {
    const headingEl = document.getElementById(headingId);
    const containerEl = containerRef.current;
    const buttonEl = buttonRef.current;

    if (!headingEl || !containerEl || !buttonEl) return;

    const headingRect = headingEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const buttonRect = buttonEl.getBoundingClientRect();

    const offsetWithinContainer = buttonRect.bottom - containerRect.top;
    const alignedTop = headingRect.bottom - offsetWithinContainer;
    setMobileTop(Math.max(16, Math.round(alignedTop)));
  }, [headingId]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="fixed top-[var(--mobile-button-top)] right-4 left-auto translate-x-0 sm:top-auto sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-30"
      style={{ '--mobile-button-top': `${mobileTop}px` } as CSSProperties}
    >
      <div className="relative inline-flex">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-2xl bg-zinc/80 backdrop-blur-md"
        />
        <Button
          ref={buttonRef}
          asLink
          href="/Ngatye Brian Oko CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          variant="primary-icon-left"
          size="sm"
          className="relative z-10"
          icon={
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          }
        >
          Download CV
        </Button>
      </div>
    </div>
  );
}
