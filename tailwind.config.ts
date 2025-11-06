import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			zinc: {
  				'50': '#fafafa',
  				'100': '#f4f4f5',
  				'200': '#e4e4e7',
  				'300': '#d4d4d8',
  				'400': '#a1a1aa',
  				'500': '#71717a',
  				'600': '#52525b',
  				'700': '#3f3f46',
  				'800': '#27272a',
  				'900': '#18181b',
  				'950': '#09090b'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			display: [
  				'calc(40px + 1.5625vw)',
  				{
  					lineHeight: '1.1'
  				}
  			],
  			h1: [
  				'calc(32px + 1.25vw)',
  				{
  					lineHeight: '1.1'
  				}
  			],
  			h2: [
  				'calc(24px + 0.9375vw)',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			h3: [
  				'calc(20px + 0.78125vw)',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			h4: [
  				'calc(16px + 0.625vw)',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			h5: [
  				'calc(12px + 0.46875vw)',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			h6: [
  				'calc(10px + 0.390625vw)',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			body: [
  				'calc(15px + 0.390625vw)',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			small: [
  				'calc(10px + 0.078125vw)',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			xs: [
  				'calc(6px + 0.078125vw)',
  				{
  					lineHeight: '1.5'
  				}
  			]
  		},
  		lineHeight: {
  			'fluid-tight': 'calc(1.1 + (1.3 - 1.1) * ((100vw - 320px) / (1920 - 320)))',
  			'fluid-snug': 'calc(1.2 + (1.4 - 1.2) * ((100vw - 320px) / (1920 - 320)))',
  			'fluid-normal': 'calc(1.4 + (1.5 - 1.4) * ((100vw - 320px) / (1920 - 320)))',
  			'fluid-relaxed': 'calc(1.6 + (1.7 - 1.6) * ((100vw - 320px) / (1920 - 320)))',
  			'fluid-loose': 'calc(1.7 + (1.8 - 1.7) * ((100vw - 320px) / (1920 - 320)))',
  			'fluid-about': 'calc(1.3 + (1.8 - 1.3) * ((100vw - 320px) / (1920 - 320)))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
