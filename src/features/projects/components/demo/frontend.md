# Flusso Frontend - Natural Language Project Creation

A beautiful, modern React frontend for AI-powered project planning. Turn project ideas into structured plans with tasks, dependencies, and timelines in under 60 seconds.

## 🎨 Design Philosophy

This frontend follows a distinctive aesthetic direction:

- **Color Palette**: Warm gradient system (amber, orange, rose) that conveys energy and action
- **Typography**: Clear hierarchy with bold headings and readable body text
- **Animations**: Purposeful micro-interactions that provide feedback without being distracting
- **Layout**: Clean, spacious design with strategic use of cards and gradients
- **User Flow**: Linear, confidence-building progression from idea to structured plan

## 🏗️ Architecture Overview

### Component Structure

```
Frontend Architecture (Next.js 14+)
│
├── Pages/Routes
│   ├── /projects/new           → Prompt Page (entry point)
│   ├── /projects/new/chat      → Chat Page (progress feedback)
│   └── /projects/new/review    → Review overlay
│
├── State Management
│   ├── useProjectFlow          → Main state machine
│   └── useProjectGeneration    → API mutations (React Query)
│
├── Components
│   ├── PromptPage              → Initial prompt collection
│   ├── ChatPage                → Animated progress feedback
│   ├── ProjectReview           → Slide-in review panel
│   ├── TaskList                → Expandable task cards
│   └── DependencyGraph         → Interactive SVG visualization
│
└── Utilities
    ├── Types (TypeScript)      → Domain models
    └── Tailwind Config         → Custom theme & animations
```

### State Flow

```
IDLE
  ↓ (user submits prompt)
VALIDATING (2-3s)
  ↓ (validation succeeds)
GENERATING (15-45s)
  ↓ (generation succeeds)
REVIEW
  ↓ (user saves/discards)
IDLE

ERROR states can branch from VALIDATING or GENERATING
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Required environment variables:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Key Features

### 1. Progressive Feedback System

The Chat Page provides real-time updates during generation:

- **Validating**: "Understanding your request..."
- **Generating**: Multiple messages appear over time
  - "Initializing the project..." (immediate)
  - "Creating tasks and dependencies..." (8s)
  - "Calculating timelines..." (15s)
  - "Almost done..." (22s)

### 2. Interactive Task Visualization

Three view modes for reviewing generated projects:

- **List View**: Expandable cards with full task details
- **Timeline View**: Chronological visualization with due dates
- **Dependencies View**: Interactive graph showing task relationships

### 3. Smart Error Handling

Context-aware error messages with actionable guidance:

- Validation errors → Tips for better prompts
- Generation errors → Retry with same prompt
- Network errors → Automatic retry with exponential backoff

### 4. Smooth Animations

All transitions use CSS animations for 60fps performance:

- Slide-in panel (review page)
- Fade-in messages (chat page)
- Expand/collapse (task cards)
- Hover states (buttons, cards)

## 🎨 Component Guide

### PromptPage

Entry point for project creation.

**Features:**

- Large textarea with validation
- Quick prompt cards for common use cases
- Character count feedback
- Disabled state during loading

**Design Details:**

- Gradient background with blur effects
- Floating UI elements
- Prominent CTA button with gradient
- Warm color scheme (amber/orange/rose)

### ChatPage

Shows AI processing progress with animated messages.

**Features:**

- Stage-specific messages (validating vs generating)
- Sequential message appearance
- Typing indicator
- Progress bar with time estimate

**Design Details:**

- Bot avatar with sparkle icon
- Chat bubble design
- Animated dots for "thinking"
- Subtle background animations

### ProjectReview

Slide-in panel for reviewing and editing generated projects.

**Features:**

- Three view modes (list/timeline/dependencies)
- Inline editing of project name
- Task expansion for details
- Save/Regenerate/Discard actions

**Design Details:**

- Full-height slide-in from right
- Gradient header
- Tab navigation
- Sticky footer with actions

### TaskList

Expandable task cards with complete details.

**Features:**

- Priority badges with color coding
- Dependency chips
- Tag display
- Expand/collapse animation

**Design Details:**

- Numbered task indicators
- Hover effects
- Smooth expand animation
- Organized information hierarchy

### DependencyGraph

Interactive SVG visualization of task dependencies.

**Features:**

- Automatic layout using topological sort
- Click to highlight connected tasks
- Priority-based coloring
- Responsive to window size

**Design Details:**

- Clean arrows showing flow
- Color-coded nodes
- Interactive hover states
- Legend for clarity

## 📱 Responsive Design

All components are fully responsive:

- **Mobile**: Single column, stacked layout
- **Tablet**: 2-column grids where appropriate
- **Desktop**: Full layout with side panels

Breakpoints follow Tailwind defaults:

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 🎭 Animation Guide

Custom animations defined in `tailwind.config.ts`:

```typescript
// Slide in from bottom
animate - slideIn;

// Fade in
animate - fadeIn;

// Scale in
animate - scaleIn;

// Progress bar
animate - progress;

// Slow spin (for icons)
animate - spin - slow;
```

## 🔧 Customization

### Colors

The theme uses a warm gradient palette. To customize:

```typescript
// tailwind.config.ts
colors: {
  brand: {
    orange: { /* shades */ },
    rose: { /* shades */ },
    amber: { /* shades */ },
  }
}
```

### Fonts

Import custom fonts in `app/layout.tsx`:

```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
```

### Animations

Adjust timing in `tailwind.config.ts`:

```typescript
animation: {
  'progress': 'progress 30s linear forwards', // Change 30s
}
```

## 🐛 Troubleshooting

### Issue: Components not rendering

**Solution**: Ensure you're using Client Components with `'use client'` directive

### Issue: Animations not working

**Solution**: Check Tailwind config is properly loaded and CSS is compiled

### Issue: API calls failing

**Solution**: Verify `NEXT_PUBLIC_API_URL` is set and backend is running

### Issue: Type errors

**Solution**: Run `npm run type-check` and fix TypeScript errors

## 📊 Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Pages are automatically split by Next.js
2. **React Query Caching**: API responses cached for 5 minutes
3. **CSS-only Animations**: No JavaScript animation libraries
4. **SVG for Graphics**: Dependency graph uses native SVG (no Canvas)
5. **Lazy Loading**: Heavy components loaded only when needed

### Bundle Size

Approximate bundle sizes (gzipped):

- Initial load: ~80KB
- Components: ~40KB
- Dependencies: ~150KB (React Query, Next.js)
- Total: ~270KB

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Then deploy the `.next` folder according to your platform's guidelines.

## 📝 Environment Variables

```env
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Add comments for complex logic
4. Test on mobile before submitting
5. Keep animations performant (60fps)

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] User authentication
- [ ] Database persistence
- [ ] Project templates
- [ ] Collaboration features
- [ ] Export to various formats
- [ ] Mobile app (React Native)

---

Built with ❤️ using Next.js, React, and Tailwind CSS
