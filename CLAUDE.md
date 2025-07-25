# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Alberta Driving Knowledge Test preparation application targeted at Chinese immigrants in Canada. The app is a static single-page application (SPA) built with Next.js and Tailwind CSS, designed to help users practice for the Alberta driving knowledge test with Chinese-language interface and explanations.

## Development Commands

### Initial Setup
```bash
# Initialize Next.js project with TypeScript and Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install

# Development server
npm run dev

# Build for production (static export)
npm run build
npm run export  # or use next export if configured

# Linting
npm run lint
npm run lint:fix  # if configured
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/components/Quiz.test.tsx

# Test coverage
npm run test:coverage
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js with App Router and static export (`next export`)
- **Styling**: Tailwind CSS for responsive design
- **Language**: TypeScript for type safety
- **Deployment**: GitHub Pages (static hosting)
- **Images**: Alibaba Cloud OSS for traffic sign images

### Core Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage with start button
│   ├── quiz/              # Quiz pages
│   │   └── page.tsx       # Quiz interface
│   ├── results/           # Results pages
│   │   └── page.tsx       # Score and answer review
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── QuizQuestion.tsx   # Individual question component
│   ├── ProgressBar.tsx    # Quiz progress indicator
│   ├── ScoreDisplay.tsx   # Results score display
│   └── AnswerReview.tsx   # Answer explanation component
├── data/                  # Static data
│   └── questions.json     # Question database
├── lib/                   # Utility functions
│   ├── quiz.ts           # Quiz logic and randomization
│   └── types.ts          # TypeScript type definitions
└── styles/               # Global styles
    └── globals.css       # Tailwind imports and custom styles
```

### Data Structure

The question database (`src/data/questions.json`) follows this structure:
```typescript
interface Question {
  id: number;
  question: string;           // Chinese question text
  options: string[];          // Multiple choice options (A, B, C, D)
  correctAnswer: string;      // Correct answer key
  explanation: string;        // Chinese explanation
  imageUrl?: string;         // Optional OSS image URL
  category?: string;         // Question category for balanced selection
}
```

### Key Application Logic

#### Quiz Randomization
- Randomly select 30 questions from the question pool
- Ensure balanced coverage across different traffic rule categories
- Implement fair shuffling algorithm for consistent experience
- Store current quiz session in component state (no persistence needed)

#### Static Export Configuration
Configure `next.config.js` for GitHub Pages deployment:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

### Responsive Design Considerations
- Mobile-first approach using Tailwind CSS breakpoints
- Ensure question images scale properly on all devices
- Touch-friendly interface for mobile users
- Support for both portrait and landscape orientations

### Chinese Language Support
- Ensure UTF-8 encoding throughout the application
- Use web-safe Chinese fonts with proper fallbacks
- Consider font loading performance for Chinese characters
- Implement proper text wrapping for Chinese content

### Performance Optimization
- Lazy load question images from Alibaba Cloud OSS
- Optimize Next.js static export for fast loading
- Minimize JavaScript bundle size
- Implement proper caching headers for static assets

## Development Guidelines

### Component Development
- Create reusable components for quiz functionality
- Use TypeScript interfaces for all props and data structures
- Implement proper error boundaries for question loading
- Follow Next.js App Router patterns for navigation

### State Management
- Use React hooks for local component state
- No global state management needed (simple application)
- Store quiz progress in memory only (no persistence required)
- Handle quiz reset functionality cleanly

### Image Integration
- All traffic sign images hosted on Alibaba Cloud OSS
- Implement proper loading states for images
- Handle image loading errors gracefully
- Optimize image sizes for web delivery

### Accessibility
- Ensure proper contrast ratios for Chinese text
- Implement keyboard navigation support
- Add proper ARIA labels for quiz interface
- Support screen readers for accessibility compliance

## Deployment Process

### GitHub Pages Setup
1. Build static export: `npm run build && npm run export`
2. Configure GitHub Pages to serve from `/out` directory or `gh-pages` branch
3. Ensure all paths are relative for GitHub Pages subdirectory hosting
4. Test deployed version thoroughly before release

### Content Updates
1. Update questions in `src/data/questions.json`
2. Upload new traffic sign images to Alibaba Cloud OSS
3. Update image URLs in question database
4. Rebuild and redeploy application

## Testing Strategy

### Unit Testing
- Test quiz randomization logic
- Verify question selection algorithms
- Test score calculation accuracy
- Validate answer checking logic

### Integration Testing
- Test complete quiz flow (start → questions → results)
- Verify proper navigation between pages
- Test responsive design on various screen sizes
- Validate Chinese text rendering and font loading

### User Acceptance Testing
- Test with actual Chinese immigrants
- Verify question accuracy against official Alberta handbook
- Ensure cultural appropriateness of content and interface
- Validate accessibility with assistive technologies