"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ArchiveEntry = {
  year: string;
  project: string;
  contribution: string;
  impact: string;
  image: string;
  alt: string;
};

const ARCHIVE_ITEMS: ArchiveEntry[] = [
  {
    year: '2024',
    project: 'Sópu',
    contribution: 'E-commerce web design',
    impact: 'Reusable booking UI kit',
    image: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710638/sopu1_re3uoz.mp4',
    alt: 'Sopu booking dashboard',
  },
  {
    year: '2024',
    project: 'Christmas Cards',
    contribution: 'Print Design',
    impact: 'Seasonal run of 500',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764609914/Design_in_english_intc32.png',
    alt: 'Christmas cards artwork',
  },
  {
    year: '2023',
    project: 'Pillsure',
    contribution: 'Product Strategy, User Research, Web Design',
    impact: 'Product strategy direction',
    image: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710686/pillsure1_fm8ahw.mp4',
    alt: 'Pillsure experience video',
  },
  {
    year: '2023',
    project: 'Ndowe Day',
    contribution: 'T-shirt Design, Poster design',
    impact: 'Raised awareness',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764608396/ndowe_camiseta0_vgzh23.jpg',
    alt: 'Ndowe Day campaign visuals',
  },
  {
    year: '2022',
    project: 'Investec',
    contribution: 'Heuristic Evaluation',
    impact: 'key journeys simplified',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764609400/investec_olwu5l.png',
    alt: 'Investec interface audit screens',
  },
  {
    year: '2022',
    project: 'Exploring Crytpo',
    contribution: 'Product research & prototyping',
    impact: 'Learning about crypto',
    image: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607466/crypto_qvsnvp.mp4',
    alt: 'Exploring crypto interactions',
  },
  {
    year: '2021',
    project: 'Fiserv',
    contribution: 'IA, Design System, UX/UI, Design QA',
    impact: 'faster design outputs, consistent design process',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764624156/fiserv_cover_zlvh5g.png',
    alt: 'Fiserv product screens',
  },
  {
    year: '2020',
    project: 'DTB',
    contribution: 'Mobile UX/UI Design, Animaiton',
    impact: ' ',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/dtb_hzreqc.gif',
    alt: 'DTB mobile experience',
  },
  {
    year: '2019',
    project: 'TotallyMoney',
    contribution: 'User Research, User testing, UX/UI, Copywritting, Project Management',
    impact: '80% Opt in increase, Higher visit rate',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764675589/tm_permissions-capture_prototype_mobile_iihrgk.gif',
    alt: 'TotallyMoney experience',
  },
  {
    year: '2017',
    project: 'Maserati',
    contribution: 'Website roadmap, template design, guest research, storyboards, team facilitation',
    impact: '2 projects gained',
    image: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710559/hey-oko25/oa7bxx9v6ln7vomkzcgb.mp4',
    alt: 'Maserati experience',
  },
  {
    year: '2012',
    project: 'Play Rebel',
    contribution: 'Concept & Animation',
    impact: ' ',
    image: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607472/Rebel_play_kx602e.mp4',
    alt: 'Play Rebel animation',
  },
  {
    year: '2012',
    project: 'Amplify',
    contribution: 'Final degree project',
    impact: ' ',
    image: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/Amplify_g1lq1q.png',
    alt: 'Amplify project screens',
  },


];

export function ArchiveTable() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headersRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // @ts-ignore
      const sectionsArray = window.__navigationSections || [];
      const alreadyIncluded = sectionsArray.some(
        (section: { id: string }) => section.id === 'archive'
      );

      if (!alreadyIncluded) {
        sectionsArray.push({ id: 'archive', label: 'Archive' });
        // @ts-ignore
        window.__navigationSections = sectionsArray;
        window.dispatchEvent(
          new CustomEvent('navigationSectionsUpdated', { detail: { sections: sectionsArray } })
        );
      }
    } catch (error) {
      console.error('Failed to register archive section with NavigationProgress:', error);
    }
  }, []);

  const setRowRef = (index: number) => (el: HTMLDivElement | null) => {
    rowRefs.current[index] = el;
  };

  const setImageRef = (index: number) => (el: HTMLDivElement | null) => {
    imageRefs.current[index] = el;
  };
  const setMobileImageRef = (index: number) => (el: HTMLDivElement | null) => {
    mobileImageRefs.current[index] = el;
  };

  const applyActiveRow = (targetIndex: number, immediate = false) => {
    rowRefs.current.forEach((row, index) => {
      if (!row) return;
      const background = row.querySelector('.row-background') as HTMLElement | null;
      const firstCell = row.querySelector('.first-cell') as HTMLElement | null;
      const lastCell = row.querySelector('.last-cell') as HTMLElement | null;
      const cells = row.querySelectorAll('[data-cell]');
      const isActive = index === targetIndex;

      gsap.to(background, {
        scaleY: isActive ? 1 : 0,
        duration: immediate ? 0 : 0.3,
        ease: 'power2.out',
      });

      gsap.to(cells, {
        color: isActive ? '#000000' : '#f4f4f5',
        duration: immediate ? 0 : 0.3,
        ease: 'power2.out',
      });

      gsap.to(firstCell, {
        paddingLeft: isActive ? '1rem' : '0rem',
        duration: immediate ? 0 : 0.3,
        ease: 'power2.out',
      });

      gsap.to(lastCell, {
        paddingRight: isActive ? '1rem' : '0rem',
        duration: immediate ? 0 : 0.3,
        ease: 'power2.out',
      });
    });
  };

  const animateImageChange = (targetIndex: number, immediate = false) => {
    const imageCollections = [imageRefs.current, mobileImageRefs.current];

    imageCollections.forEach((collection) => {
      collection.forEach((imageEl, index) => {
        if (!imageEl) return;
        const isActive = index === targetIndex;

        if (isActive) {
          gsap.set(imageEl, { zIndex: 2 });
          gsap.fromTo(
            imageEl,
            { opacity: immediate ? 1 : 0, scale: immediate ? 1 : 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: immediate ? 0 : 0.45,
              ease: 'power2.out',
            }
          );
        } else {
          gsap.set(imageEl, { zIndex: 1 });
          gsap.to(imageEl, {
            opacity: 0,
            duration: immediate ? 0 : 0.25,
            ease: 'power2.out',
          });
        }
      });
    });
  };

  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return;

    // Prevent flash of unstyled content
    gsap.set(titleRef.current, { opacity: 0, y: 16 });
    gsap.set(headersRef.current, { opacity: 0, y: 12 });
    rowRefs.current.forEach((row) => {
      if (!row) return;
      const cells = row.querySelectorAll('[data-cell]');
      const border = row.querySelector('.row-border');
      const background = row.querySelector('.row-background');
      gsap.set(cells, { opacity: 0, y: 18, color: '#f4f4f5' });
      gsap.set(border, { opacity: 0 });
      gsap.set(background, { scaleY: 0 });
    });
    imageRefs.current.forEach((image) => {
      if (!image) return;
      gsap.set(image, { opacity: 0, scale: 0.9 });
    });
    mobileImageRefs.current.forEach((image) => {
      if (!image) return;
      gsap.set(image, { opacity: 0, scale: 0.9 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          hasAnimated.current = true;
        },
      },
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }).to(
      headersRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.1
    );

    rowRefs.current.forEach((row, index) => {
      if (!row) return;
      const border = row.querySelector('.row-border');
      const cells = row.querySelectorAll('[data-cell]');

      if (border) {
        tl.to(
          border,
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          },
          index * 0.08 + 0.35
        );
      }

      cells.forEach((cell, cellIndex) => {
        tl.to(
          cell,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          index * 0.08 + 0.35 + cellIndex * 0.04
        );
      });
    });

    tl.call(() => {
      applyActiveRow(0, true);
      animateImageChange(0, true);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      rowRefs.current.forEach((row) => {
        if (row) {
          gsap.killTweensOf(row);
          gsap.killTweensOf(row.querySelectorAll('[data-cell]'));
          gsap.killTweensOf(row.querySelector('.row-border'));
          gsap.killTweensOf(row.querySelector('.row-background'));
        }
      });
      imageRefs.current.forEach((image) => {
        if (image) {
          gsap.killTweensOf(image);
        }
      });
      mobileImageRefs.current.forEach((image) => {
        if (image) {
          gsap.killTweensOf(image);
        }
      });
    };
  }, []);

  useEffect(() => {
    applyActiveRow(activeIndex);
    animateImageChange(activeIndex);
  }, [activeIndex]);

  return (
    <section
      id="archive"
      ref={sectionRef}
      className="w-full mt-16"
    >
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="col-span-4 lg:col-span-12">
          <h3 ref={titleRef} className="hidden lg:block text-h3 font-light text-zinc-100 mb-6 opacity-0">
            Archive
          </h3>
        </div>

        <div className="col-span-4 lg:col-span-12 grid grid-cols-4 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="col-span-4 lg:col-span-5 lg:col-start-1 order-2 lg:order-1 lg:row-start-1">
            <div className="lg:hidden sticky top-0 z-20 bg-background space-y-4">
              <h3 className="text-h3 font-light text-zinc-100">
                Archive
              </h3>
              <div className="relative w-full h-full min-h-[220px] overflow-hidden rounded-none">
                {ARCHIVE_ITEMS.map((item, index) => (
                  <div
                    key={`${item.project}-mobile`}
                    ref={setMobileImageRef(index)}
                    className="absolute inset-0 opacity-0"
                  >
                    {item.image.endsWith('.mp4') || item.image.endsWith('.webm') ? (
                      <video
                        src={item.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain object-top"
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="100vw"
                        className="object-contain object-top w-full h-full"
                        priority={index === 0}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div
                className="grid grid-cols-[80px_1fr_1.4fr] gap-0 border-b border-zinc-800 pb-3"
              >
                <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                  Year
                </div>
                <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                  Project
                </div>
                <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                  Contribution
                </div>
              </div>
            </div>
            <div
              ref={headersRef}
              className="hidden lg:grid grid-cols-[80px_1fr_1.4fr] lg:grid-cols-[80px_1fr_1.6fr_1fr] gap-0 border-b border-zinc-800 pb-3 opacity-0"
            >
              <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                Year
              </div>
              <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                Project
              </div>
              <div className="pl-0 pr-4 py-2 text-sm font-medium text-zinc-400 text-left">
                Contribution
              </div>
              <div className="pl-0 pr-0 py-2 text-sm font-medium text-zinc-400 text-right hidden lg:block">
                Impact
              </div>
            </div>

            <div className="space-y-0">
              {ARCHIVE_ITEMS.map((item, index) => (
                <div
                  key={item.project}
                  ref={setRowRef(index)}
                  className="relative cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  tabIndex={0}
                >
                  <div
                    className="row-border border-b border-zinc-800 absolute bottom-0 left-0 right-0"
                    style={{ display: index === ARCHIVE_ITEMS.length - 1 ? 'none' : 'block' }}
                  />

                  <div
                    className="row-background absolute inset-0 origin-bottom"
                    style={{
                      transform: 'scaleY(0)',
                      backgroundColor: '#ffffff',
                      zIndex: 1,
                    }}
                  />

                  <div className="grid grid-cols-[80px_1fr_1.4fr] lg:grid-cols-[80px_1fr_1.6fr_1fr] gap-0 relative z-10">
                    <div
                      data-cell
                      className="first-cell py-4 pr-4 text-sm font-thin text-zinc-100 text-left opacity-0 pl-0"
                      style={{ transform: 'translateY(18px)' }}
                    >
                      {item.year}
                    </div>
                    <div
                      data-cell
                      className="py-4 pr-4 text-sm font-thin text-zinc-100 text-left break-words opacity-0 pl-0"
                      style={{ transform: 'translateY(18px)' }}
                    >
                      {item.project}
                    </div>
                    <div
                      data-cell
                      className="py-4 pr-4 text-sm font-thin text-zinc-100 text-left break-words opacity-0 pl-0"
                      style={{ transform: 'translateY(18px)' }}
                    >
                      {item.contribution}
                    </div>
                    <div
                      data-cell
                      className="last-cell py-4 text-sm font-thin text-zinc-100 text-right hidden lg:block opacity-0 pr-0 pl-0"
                      style={{ transform: 'translateY(18px)' }}
                    >
                      {item.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative col-span-4 lg:col-span-7 lg:col-start-6 order-1 lg:order-2 lg:row-start-1 w-full h-full min-h-[260px] lg:min-h-[520px] overflow-hidden rounded-none hidden lg:block">
            {ARCHIVE_ITEMS.map((item, index) => (
              <div
                key={item.project}
                ref={setImageRef(index)}
                className="absolute inset-0 opacity-0"
              >
                {item.image.endsWith('.mp4') || item.image.endsWith('.webm') ? (
                  <video
                    src={item.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain object-top"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain object-top w-full h-full"
                    priority={index === 0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
