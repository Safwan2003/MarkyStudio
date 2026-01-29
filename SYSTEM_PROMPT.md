# MarkyStudio: AI SaaS Explainer Video Generator - System Prompt

Build **MarkyStudio**, an AI-powered platform that transforms user inputs into agency-quality SaaS explainer videos (60-90 seconds).

## Core Functionality

**Inputs from User:**
1. Product screenshots/mockups (digital product interface)
2. Product name & tagline
3. Target audience/pain points
4. Key features (3-5 bullet points)
5. Brand colors (primary, accent)
6. Website URL & CTA text

**Output:**
Complete video with synchronized narrative audio across 5 scenes, built using Remotion (React-based video framework).

---

## Video Structure (5-Scene Narrative Arc)

### 1. **Intro/Hook** (0-10s)
- **Visual**: Laptop mockup on office desk with product screenshot
- **Animation**: Progressive chaos - communication app icons (WhatsApp, Slack, Gmail, etc.) flood the screen with notification badges
- **Audio Narrative**: Hook statement about the problem (e.g., "Managing feedback across 12 apps?")
- **Tech**: Floating SVG icons with spring animations, chat bubble overlays

### 2. **Problem** (10-25s)  
- **Visual**: 3-phase sequence
  - Phase 1: Animated logo reveal (brand name → logo icon with gradient)
  - Phase 2: Dashboard interface showing user greeting + project cards
  - Phase 3: Team member avatars appear around dashboard (roles: Developer, Designer, Manager, QA, Copywriter)
- **Animation**: Sequential pop-in with spring physics
- **Audio Narrative**: Agitate pain points with specific scenarios
- **Tech**: Phased conditional rendering, color-coded role labels

### 3. **Solution** (25-40s)
- **Visual**: Clean product mockup with "aha moment" UI
- **Animation**: Smooth zoom into interface, glassmorphism effects
- **Audio Narrative**: Introduce product as the solution
- **Tech**: Browser frame component, gradient backgrounds, smooth transitions

### 4. **Showcase** (40-65s) - **CRITICAL INTERACTION**
- **Visual**: High-fidelity browser mockup showing product in use
- **Dynamic Interactions**:
  - Animated cursor moves across screen
  - Clicks on UI elements (buttons, features)
  - UI responds: graphs animate, notifications appear, panels slide in
  - Screenshots transition showing multiple features
- **Audio Narrative**: Feature walkthrough with benefits
- **Tech**: Cursor component, click ripple effects, screenshot carousels, programmatic UI animations

### 5. **Social Proof + CTA** (65-90s)
- **Visual**: 
  - Testimonials/metrics (optional user logos or stats)
  - Large CTA button with website URL
  - Clean background with brand colors
- **Animation**: Fade-in elements, pulsing CTA
- **Audio Narrative**: Social proof statement + call to action
- **Tech**: Centered layout, animated metrics counters

---

## Technical Implementation

### Technology Stack:
- **Framework**: Remotion (React for video)
- **Animations**: Spring physics + interpolation
- **Components**: Modular scenes (Intro, Problem, Solution, Showcase, CTA)
- **Styling**: Inline React styles with dynamic theme injection
- **Audio**: AI-generated voice narration synced to scenes

### Data Flow:
```javascript
{
  globalDesign: {
    primaryColor: "#2563EB",
    accentColor: "#F59E0B", 
    headingFont: "Inter",
    bodyFont: "Inter"
  },
  scenes: [
    { type: "intro", duration: 10, mainText: "...", screenshots: [...] },
    { type: "problem", duration: 15, mainText: "...", subText: "..." },
    { type: "solution", duration: 15, mainText: "...", features: [...] },
    { type: "showcase", duration: 25, screenshots: [...], interactions: [...] },
    { type: "cta", duration: 10, ctaText: "...", websiteUrl: "..." }
  ]
}
```

### Key Features:
- **No Hardcoded Values**: All text, colors, and assets injected via props
- **Responsive Timing**: Scene durations adjust based on content
- **Professional Polish**: Noise overlays, bokeh effects, shadows, gradients
- **Brand Consistency**: User's brand colors throughout all scenes

---

## AI Generation Workflow

1. **User submits**: Product info + screenshots + brand colors
2. **AI analyzes**: Extracts pain points, features, value props
3. **Script generation**: Creates narrative for each scene with timing
4. **Voice synthesis**: Generates professional narration audio
5. **Video rendering**: Remotion compiles scenes with animations synced to audio
6. **Output**: MP4 video ready for marketing

---

## Style Requirements

- **Aesthetic**: Modern, premium, agency-quality
- **Animation**: Smooth spring physics, no jarring cuts
- **Color**: User's brand colors + professional gradients
- **Typography**: Clean sans-serif (Inter/Roboto)
- **Mockups**: Realistic laptop/browser frames with glare effects
- **Icons**: Colorful brand icons (WhatsApp, Slack, Google, etc.)

---

**Goal**: Enable non-designers to create $5,000-quality SaaS explainer videos in minutes using AI-powered narrative generation and programmatic video composition.
