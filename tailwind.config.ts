import type { Config } from "tailwindcss";

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
        // Fluid responsive typography
        // Using calc() formula: base size + fluid scaling based on viewport width
        // Display & Headings
        'display': ['calc(40px + 1.5625vw)', { lineHeight: '1.1' }], // 80px at desktop
        'h1': ['calc(32px + 1.25vw)', { lineHeight: '1.1' }],       // 64px at desktop
        'h2': ['calc(24px + 0.9375vw)', { lineHeight: '1.2' }],     // 48px at desktop
        'h3': ['calc(20px + 0.78125vw)', { lineHeight: '1.2' }],    // 40px at desktop
        'h4': ['calc(16px + 0.625vw)', { lineHeight: '1.2' }],      // 32px at desktop
        'h5': ['calc(12px + 0.46875vw)', { lineHeight: '1.3' }],    // 24px at desktop
        'h6': ['calc(10px + 0.390625vw)', { lineHeight: '1.3' }],   // 20px at desktop
        // Body
        'body': ['calc(15px + 0.390625vw)', { lineHeight: '1.5' }], // 16px at desktop
        'small': ['calc(10px + 0.078125vw)', { lineHeight: '1.5' }], // 12px at desktop
        'xs': ['calc(6px + 0.078125vw)', { lineHeight: '1.5' }],    // 8px at desktop
      },
    },
  },
  plugins: [],
} satisfies Config;
