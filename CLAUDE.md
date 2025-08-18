# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with turbopack
- `npm run build` - Build for production (configured as static export)
- `npm run start` - Start production server 
- `npm run lint` - Run ESLint (currently configured to be permissive for deployment)

## Project Architecture

This is a Next.js 15 application using the App Router architecture, configured as a static export for SEO-focused website deployment.

### Core Architecture Patterns

**Static Export Configuration**: The site is configured for static export (`output: 'export'`) with aggressive ESLint and TypeScript bypasses for deployment. This is intentional for the current deployment setup.

**App Router Structure**: Uses Next.js App Router with file-based routing in the `/app` directory.

**Content Management**: Integrates with Storyblok CMS for blog content through server-side data fetching patterns in `app/lib/storyblok.ts`.

**Component Architecture**: 
- Layout components with complex dropdown menus and state management in `app/layout.tsx`
- Reusable components in `app/components/` for newsletters, blog posts, forms, etc.
- AI-powered tools in `app/tools/` directories with their own page components

### Key Integrations

**Storyblok CMS**: Blog content is managed through Storyblok with server-side rendering. The integration uses both direct client calls and React components for visual editing.

**Firebase**: Currently uses mock/simulated data for view counts and analytics (see `app/lib/firebase.ts`). The actual Firebase integration is disabled in favor of consistent simulation.

**Google AI (Gemini)**: Integrated for AI-powered tools including blog idea generation, copywriting, and meta tag generation through API routes in `app/api/`.

**Email Integration**: Uses nodemailer for contact forms and newsletter subscriptions.

### Styling & UI

**TailwindCSS**: Comprehensive custom design system with:
- Custom color palette (primary: #2563EB, secondary: #059669, accent: #DC2626)
- Extended typography configuration for blog content
- Custom animations and responsive design patterns

**Design Patterns**: Modern glassmorphism effects, gradient text, sophisticated hover states, and mobile-first responsive design throughout.

### Content Structure

**SEO Tools**: Multiple free SEO tools located in `/app/tools/` including keyword analyzers, meta tag optimizers, HTML editors, etc.

**Service Pages**: Professional SEO service pages in `/app/services/` covering local SEO, eCommerce SEO, link building, technical audits, and consulting.

**Blog System**: Storyblok-powered blog with reading progress, social sharing, table of contents, and related posts functionality.

## Development Notes

**TypeScript**: Configured with strict settings but deployment bypasses are in place. Follow existing patterns for component typing.

**State Management**: Uses React hooks for local state. Complex state like dropdown menus and cookie consent managed in the root layout.

**API Routes**: All API endpoints are in `/app/api/` and handle AI content generation, form submissions, and newsletter subscriptions.

**Image Optimization**: Configured for unoptimized images due to static export requirement.

**SEO Implementation**: Comprehensive SEO with structured data, meta tags, OpenGraph, and Twitter cards implemented throughout the application.

## Common Development Patterns

When working with this codebase:

- Follow the existing component patterns with Tailwind utility classes
- Use the established color scheme and typography system
- Implement proper TypeScript interfaces for new components
- Add proper ARIA labels and semantic HTML for accessibility
- Include structured data (JSON-LD) for new pages when appropriate
- Test responsive design on mobile, tablet, and desktop breakpoints