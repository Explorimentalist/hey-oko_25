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
      },
      fontSize: {
        // Display & Headings
        'display': ['80px', { lineHeight: '1.1' }],
        'h1': ['64px', { lineHeight: '1.1' }],
        'h2': ['48px', { lineHeight: '1.2' }],
        'h3': ['40px', { lineHeight: '1.2' }],
        'h4': ['32px', { lineHeight: '1.2' }],
        'h5': ['24px', { lineHeight: '1.3' }],
        'h6': ['20px', { lineHeight: '1.3' }],
        // Body
        'body': ['16px', { lineHeight: '1.5' }],
        'small': ['12px', { lineHeight: '1.5' }],
        'xs': ['8px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
