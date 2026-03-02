import type { Config } from "tailwindcss";

const MIN_VIEWPORT = 320;
const MAX_VIEWPORT = 1920;

const fluidSize = (minPx: number, maxPx: number): string => {
  const viewportRange = MAX_VIEWPORT - MIN_VIEWPORT;
  const slope = (maxPx - minPx) / viewportRange;
  return `clamp(${minPx.toFixed(4)}px, calc(${minPx.toFixed(4)}px + ${slope.toFixed(8)} * (100vw - ${MIN_VIEWPORT}px)), ${maxPx.toFixed(4)}px)`;
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          600: '#52525b',
          500: '#71717a',
          400: '#a1a1aa',
          300: '#d4d4d8',
          200: '#e4e4e7',
          100: '#f4f4f5',
          50: '#fafafa',
        },
      },
      fontSize: {
        // Fluid responsive typography clamped between 320px and 1920px viewports
        // Display & Headings
        'display': [fluidSize(46.6667, 80), { lineHeight: '1.1' }], // 46.67px → 80px
        'hero': [fluidSize(45, 70), { lineHeight: '1.1' }],         // 45px → 70px (Home hero)
        'h1': [fluidSize(37.3333, 64), { lineHeight: '1.1' }],      // 37.33px → 64px
        'h2': [fluidSize(28, 48), { lineHeight: '1.2' }],           // 28px → 48px
        'h3': [fluidSize(23.3333, 40), { lineHeight: '1.2' }],      // 23.33px → 40px
        'h4': [fluidSize(18.6667, 32), { lineHeight: '1.2' }],      // 18.67px → 32px
        'h5': [fluidSize(14, 24), { lineHeight: '1.3' }],           // 14px → 24px
        'h6': [fluidSize(11.6667, 20), { lineHeight: '1.3' }],      // 11.67px → 20px
        // Body
        'body': [fluidSize(15.8333, 20), { lineHeight: '1.5' }],    // 15.83px → 20px
        'small': [fluidSize(10.3333, 12), { lineHeight: '1.5', letterSpacing: '0.05rem' }],   // 10.33px → 12px
        'xs': [fluidSize(6.3333, 8), { lineHeight: '1.5' }],        // 6.33px → 8px
      },
      lineHeight: {
        // Responsive line heights that scale with viewport width
        'fluid-tight': 'calc(1.1 + (1.3 - 1.1) * ((100vw - 320px) / (1920 - 320)))',
        'fluid-snug': 'calc(1.2 + (1.4 - 1.2) * ((100vw - 320px) / (1920 - 320)))',
        'fluid-normal': 'calc(1.4 + (1.5 - 1.4) * ((100vw - 320px) / (1920 - 320)))',
        'fluid-relaxed': 'calc(1.6 + (1.7 - 1.6) * ((100vw - 320px) / (1920 - 320)))',
        'fluid-loose': 'calc(1.7 + (1.8 - 1.7) * ((100vw - 320px) / (1920 - 320)))',
        // Special class for about section
        'fluid-about': 'calc(1.3 + (1.8 - 1.3) * ((100vw - 320px) / (1920 - 320)))',
      },
      // Motion Design System
      // Durations based on component size (physics-based approach)
      transitionDuration: {
        // Opening durations
        'xs': '150ms',   // Micro-interactions (progress bars, toggles)
        'sm': '200ms',   // Small components (buttons, icons, badges)
        'md': '300ms',   // Medium components (dropdowns, cards, menus)
        'lg': '400ms',   // Large components (modals, panels, overlays)
        'xl': '500ms',   // XL components (full-page transitions, side panels)
        // Closing durations (0.68x ratio for snappier feel)
        'xs-close': '100ms',
        'sm-close': '140ms',
        'md-close': '200ms',
        'lg-close': '270ms',
        'xl-close': '340ms',
      },
      // Easing curves based on component size
      transitionTimingFunction: {
        'power1-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',   // Gentle, for large components
        'power1-in': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        'power2-out': 'cubic-bezier(0.16, 1, 0.3, 1)',          // Balanced, for medium components
        'power2-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'power3-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',    // Snappy, for small components
        'power3-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      },
      // Transform values for consistent motion
      translate: {
        // Y-axis translation based on component size
        'motion-xs': '4px',
        'motion-sm': '8px',
        'motion-md': '16px',
        'motion-lg': '24px',
        'motion-xl': '32px',
      },
      scale: {
        // Scale values for appear/disappear animations
        'motion-sm': '0.90',   // Small components (buttons, icons)
        'motion-md': '0.95',   // Medium components (cards, menus)
        'motion-lg': '0.98',   // Large components (modals, panels)
        'motion-xl': '0.99',   // XL components (page transitions)
      },
    },
  },
  plugins: [],
} satisfies Config;
