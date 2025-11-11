"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GRID_COLUMN_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const GRID_COLUMN_CLASSES_SM: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
};

const buildGridClasses = (mobileCount: number, desktopCount: number) => {
  const safeMobileCount = Math.min(Math.max(mobileCount, 1), 5);
  const safeDesktopCount = Math.min(Math.max(desktopCount, 1), 5);
  const mobileClass = GRID_COLUMN_CLASSES[safeMobileCount] ?? GRID_COLUMN_CLASSES[1];
  const desktopClass =
    safeDesktopCount === safeMobileCount
      ? ''
      : (GRID_COLUMN_CLASSES_SM[safeDesktopCount] ?? '');

  return [mobileClass, desktopClass].filter(Boolean).join(' ');
};

interface CVListProps {
  title: string;
  columns: string[];
  data: Array<Array<string | React.ReactNode>>;
  className?: string;
  mobileHiddenColumns?: number[];
}

export function CVList({
  title,
  columns,
  data,
  className = '',
  mobileHiddenColumns = [],
}: CVListProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headersRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);
  const hoverListenersAttached = useRef(false);

  // Function to set up hover animations for a specific row
  const setupRowHoverAnimation = (row: HTMLDivElement) => {
    if ((row as any)._hoverSetup) return; // Already set up
    (row as any)._hoverSetup = true;

    const backgroundElement = row.querySelector('.row-background') as HTMLElement;
    const firstCell = row.querySelector('.first-cell') as HTMLElement;
    const lastCell = row.querySelector('.last-cell') as HTMLElement;

    if (!backgroundElement || !firstCell || !lastCell) return;

    // Ensure initial state is properly set  
    gsap.set(row.querySelectorAll('[data-cell]'), { color: '#f4f4f5' });

    // Mouse enter animation
    const handleMouseEnter = () => {
      const rowCells = row.querySelectorAll('[data-cell]');
      
      // Create timeline with all animations starting at the exact same time
      const tl = gsap.timeline();
      
      // Add all animations with exactly the same start time (0)
      tl.add([
        gsap.to(backgroundElement, {
          scaleY: 1,
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(rowCells, {
          color: '#000000',
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(firstCell, {
          paddingLeft: '2rem',
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(lastCell, {
          paddingRight: '2rem',
          duration: 0.3,
          ease: 'power2.out'
        })
      ], 0);
    };

    // Mouse leave animation
    const handleMouseLeave = () => {
      const rowCells = row.querySelectorAll('[data-cell]');
      
      // Create timeline with all animations starting at the exact same time
      const tl = gsap.timeline();
      
      // Add all animations with exactly the same start time (0)
      tl.add([
        gsap.to(backgroundElement, {
          scaleY: 0,
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(rowCells, {
          color: '#f4f4f5',
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(firstCell, {
          paddingLeft: '1rem',
          duration: 0.3,
          ease: 'power2.out'
        }),
        gsap.to(lastCell, {
          paddingRight: '1rem',
          duration: 0.3,
          ease: 'power2.out'
        })
      ], 0);
    };

    row.addEventListener('mouseenter', handleMouseEnter);
    row.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup functions for later use
    (row as any)._cleanupHover = () => {
      row.removeEventListener('mouseenter', handleMouseEnter);
      row.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  // Validate column count (2-5 columns)
  if (columns.length < 2 || columns.length > 5) {
    throw new Error('CVList supports 2-5 columns only');
  }

  const sanitizedMobileHiddenColumns = Array.from(new Set(mobileHiddenColumns));

  if (sanitizedMobileHiddenColumns.some((index) => index < 0 || index >= columns.length)) {
    throw new Error('mobileHiddenColumns contains invalid column indices');
  }

  if (sanitizedMobileHiddenColumns.length && sanitizedMobileHiddenColumns.length >= columns.length) {
    throw new Error('At least one column must remain visible on mobile');
  }

  // Validate data consistency
  data.forEach((row, index) => {
    if (row.length !== columns.length) {
      throw new Error(`Row ${index} has ${row.length} cells but ${columns.length} columns are defined`);
    }
  });

  const mobileHiddenColumnsSet = new Set(sanitizedMobileHiddenColumns);
  const mobileColumnCount = Math.max(1, columns.length - mobileHiddenColumnsSet.size);
  const gridClasses = buildGridClasses(mobileColumnCount, columns.length);
  const getColumnVisibilityClass = (index: number) =>
    mobileHiddenColumnsSet.has(index) ? 'hidden sm:block' : '';

  useEffect(() => {
    if (!tableRef.current || hasAnimated.current) return;

    // Initial states are now set via CSS classes to prevent flash

    // Set up scroll trigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: tableRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const tl = gsap.timeline();
        
        // 1. Fade in title heading
        tl.to(titleRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        // 2. Fade in column headers
        tl.to(headersRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.2);

        // 3. Animate rows sequentially
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          
          const borderBottom = row.querySelector('.row-border');
          const cells = row.querySelectorAll('[data-cell]');
          
          // Animate border first
          if (borderBottom) {
            tl.to(borderBottom, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out'
            }, index * 0.1 + 0.6);
          }
          
          // Then animate cells in sequence
          cells.forEach((cell, cellIndex) => {
            tl.to(cell, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            }, index * 0.1 + 0.6 + (cellIndex * 0.05));
          });

          // Enable hover for this specific row after its last cell animates
          const lastCellTime = index * 0.1 + 0.6 + ((cells.length - 1) * 0.05) + 0.4;
          tl.call(() => setupRowHoverAnimation(row), [], lastCellTime);
        });
      }
    });

    // Hover animations are now set up after scroll animation completes

    // Cleanup function
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      // Clean up GSAP tweens
      if (titleRef.current) {
        gsap.killTweensOf(titleRef.current);
      }
      if (headersRef.current) {
        gsap.killTweensOf(headersRef.current);
      }
      rowRefs.current.forEach((row) => {
        if (row) {
          gsap.killTweensOf(row);
          gsap.killTweensOf(row.querySelectorAll('[data-cell]'));
          gsap.killTweensOf(row.querySelector('.row-border'));
          // Clean up hover listeners if they exist
          if ((row as any)._cleanupHover) {
            (row as any)._cleanupHover();
          }
        }
      });
    };
  }, [data]);

  return (
    <div ref={tableRef} className={`cv-list ${className}`}>
      {/* H3 Heading */}
      <h3 ref={titleRef} className="text-h3 font-light text-zinc-100 mb-8 opacity-0">
        {title}
      </h3>

      {/* Column Headers */}
      <div 
        ref={headersRef}
        className={`grid gap-0 border-b border-zinc-700 pb-4 mb-0 opacity-0 ${gridClasses}`}
      >
        {columns.map((column, index) => (
          <div
            key={index}
            className={`px-4 py-2 text-sm font-medium text-zinc-400 ${
              index === columns.length - 1 ? 'text-right' : 'text-left'
            } ${getColumnVisibilityClass(index)}`}
          >
            {column}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="space-y-0">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            ref={(el) => (rowRefs.current[rowIndex] = el)}
            className="relative cursor-pointer"
          >
            {/* Border element for animation */}
            <div 
              className="row-border border-b border-zinc-800 absolute bottom-0 left-0 right-0 opacity-0"
              style={{ display: rowIndex === data.length - 1 ? 'none' : 'block' }}
            />
            
            {/* Background element for hover effect */}
            <div 
              className="row-background absolute inset-0 origin-bottom"
              style={{ 
                transform: 'scaleY(0)',
                backgroundColor: '#ffffff',
                zIndex: 1
              }}
            />
            
            {/* Row content */}
            <div 
              className={`grid gap-0 relative z-10 ${gridClasses}`}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  data-cell
                  className={`
                    py-4 px-4 text-sm font-thin text-zinc-100 opacity-0
                    ${cellIndex === 0 ? 'first-cell' : ''}
                    ${cellIndex === row.length - 1 ? 'last-cell text-right' : 'text-left'}
                    ${getColumnVisibilityClass(cellIndex)}
                  `}
                  style={{ transform: 'translateY(20px)' }}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
