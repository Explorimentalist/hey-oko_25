# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hey-Oko is a premium design portfolio website for Ngatye Brian Oko, built as an art project standing alongside Awwwards portfolio websites. The site balances artistic expression with functional navigation, using visual storytelling to showcase design capabilities.

## Development Commands

### Basic Commands
- `npm run dev` - Start development server
- `npm run dev:tina` - Start development with TinaCMS in local mode
- `npm run build` - Build for production (includes TinaCMS build with local mode and cloud checks skip)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### TinaCMS Development
The project uses TinaCMS with local media storage. Use `npm run dev:tina` for content editing with the admin interface at `/admin`.

## Architecture

### Tech Stack
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **TinaCMS** for content management (local mode)
- **GSAP** for animations and scroll triggers
- **Three.js** with React Three Fiber for 3D elements
- **Tailwind CSS** for styling
- **GeneralSans** font from public/fonts/

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by domain:
  - `home/` - Homepage specific components
  - `shared/` - Reusable components (CustomCursor, Footer, Menu, etc.)
  - `animations/` - GSAP and animation components
- `content/` - TinaCMS content (posts, projects)
- `tina/` - TinaCMS configuration and generated types
- `public/` - Static assets including image sequences and fonts

### Content Management
- **TinaCMS** configured for local development with media stored in `public/uploads/`
- Content types: Posts and Projects with rich-text body and image sequences
- Admin interface available at `/admin` during development

### Visual Features
- **Custom cursor** implementation
- **GSAP scroll animations** and image sequence playback
- **Three.js 3D elements** with shader gradients
- **Responsive grid system** (4-col mobile, 8-col tablet, 12-col desktop)
- **Navigation progress indicator** with section navigation

### Component Patterns
- Components use TypeScript interfaces for props
- Animation components leverage GSAP's ScrollTrigger
- Image sequences follow Apple-style canvas-based animation patterns
- Custom cursor tracks mouse movement with GSAP

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for grid system and complex animations
- **Dark theme** by default with appropriate favicon switching
- **GeneralSans font** loaded locally from `/public/fonts/`

### API Routes
- `/api/cloudinary/[...media]` - Media handling (though currently using local storage)
- TinaCMS API routes generated automatically

## Important Notes

- The project is configured for local-only TinaCMS development (no cloud connection required)
- Image sequences are stored in `public/images/` with specific folder structures for projects
- GSAP animations require careful timing coordination with React lifecycle
- Three.js components need proper cleanup to prevent memory leaks
- Custom cursor requires mouse event handling across the entire application