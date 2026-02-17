# Yapsy — Marketing Website Product Requirements Document

> **Landing page + waitlist for Yapsy's pre-launch.**

**Project**: Yapsy Marketing Website  
**Stack**: Next.js 16+ (App Router) · TypeScript · TailwindCSS · Framer Motion  
**Domain**: yapsy.app  
**Goal**: Waitlist signups, early traction tracking, email capture for "1st month free" blast  
**Author**: Devansh  
**Date**: February 2026

---

## 1. Overview

A single-page, heavily animated marketing website for Yapsy's pre-launch. The site's job is simple: **explain what Yapsy does and capture email addresses for the waitlist.** The design mirrors the app's playful, gradient-rich, rounded aesthetic seen in the Figma mockups.

**Primary KPI:** Waitlist signups (email capture)  
**Secondary KPI:** Page scroll depth, time on site, social shares

**Not included:** Blog, pricing page, login, docs, support. This is a single focused landing page with a waitlist CTA.

---

## 2. Design Language

The website should feel like a **premium consumer app launch** — not a SaaS B2B page. Think: Apple product launches meets Headspace's warmth, with the playful gradient energy of the Yapsy app itself.

### 2.1 Colour System

```
PRIMARY ACCENT:        #B153D7

BLACK:                 #191919
WHITE (warm):          #FFF4EA
NEUTRAL (grey):        #D4D2D1

PRIMARY GRADIENT:      #FCB0F3 → #3D05DD  (left → right)
BACKGROUND GRADIENT:   #F6C4ED → #C798E8  (left → right)
SUCCESS GRADIENT:      #6EEE87 → #18C63A  (left → right)
ERROR GRADIENT:        #EA5459 → #D3321D  (left → right)
```

### CSS Custom Properties

```css
:root {
  --accent: #B153D7;
  --black: #191919;
  --white: #FFF4EA;
  --neutral: #D4D2D1;

  --gradient-primary: linear-gradient(90deg, #FCB0F3 0%, #3D05DD 100%);
  --gradient-bg: linear-gradient(90deg, #F6C4ED 0%, #C798E8 100%);
  --gradient-success: linear-gradient(90deg, #6EEE87 0%, #18C63A 100%);
  --gradient-error: linear-gradient(90deg, #EA5459 0%, #D3321D 100%);

  /* Glassmorphism overlay */
  --glass-bg: rgba(255, 244, 234, 0.12);
  --glass-border: rgba(255, 244, 234, 0.18);
  --glass-blur: 24px;
}
```

### 2.2 Typography

```
HEADING FONT:   Plus Jakarta Sans (Google Fonts)
  - Hero:       72px / 700 (desktop), 40px (mobile)
  - Section:    48px / 700 (desktop), 32px (mobile)
  - Sub:        24px / 600

BODY FONT:      Open Sans (Google Fonts)
  - Body:       18px / 400
  - Caption:    14px / 400
  - CTA:        16px / 600
```

### 2.3 Visual Principles

- **Gradient-heavy**: Backgrounds, buttons, accents all use gradients — never flat solid fills for key elements
- **Rounded everything**: `border-radius: 24px` for cards, `16px` for buttons, `full` for pills and avatars
- **Glassmorphism**: Cards use frosted glass effect (`backdrop-blur`, translucent backgrounds, subtle borders)
- **Depth via shadows**: Large, soft, coloured shadows (purple-tinted) for floating elements
- **Warm whites**: Never use pure `#FFFFFF` — always `#FFF4EA` or warmer
- **Playful, not corporate**: Emojis in copy, friendly illustrations, conversational tone
- **Mobile-first**: The app is mobile — the website should feel like you're previewing a mobile experience

### 2.4 Animation Philosophy

Animations are **central to the experience**, not decorative afterthoughts:

- **Parallax scrolling**: Background layers move at different speeds for depth
- **Scroll-triggered reveals**: Sections animate in as they enter viewport
- **Floating elements**: App screenshots and orb gently bob/float with easing
- **Gradient animations**: Background gradients subtly shift hue/position over time
- **Micro-interactions**: Buttons scale + glow on hover, inputs highlight on focus
- **Staggered entrances**: Lists and feature cards animate in with sequential delays
- **Magnetic cursor effect**: The orb or CTA button subtly follows cursor movement
- **Smooth scroll**: Entire page uses smooth scroll with Lenis or similar

Performance rule: All animations must run at 60fps. Use `transform` and `opacity` only — never animate `width`, `height`, or `layout` properties. Use `will-change` sparingly.

---

## 3. Page Sections (Single Page)

The entire marketing site is **ONE page** with 8 sections, a sticky nav, and a footer. Each section is a full or near-full viewport height.

### Section 0: Sticky Navigation Bar

**Behaviour:** Transparent on top, becomes frosted glass on scroll (backdrop-blur + semi-transparent bg). Collapses to hamburger on mobile.

**Elements:**
- Left: Yapsy logo (SVG wordmark, warm white)
- Right (desktop): "Features" · "How it Works" · "Pricing" (anchor links, smooth scroll) · **"Join Waitlist"** button (primary gradient, rounded pill, glow shadow)
- Right (mobile): Hamburger → slide-in menu (gradient bg)

**Animation:**
- Nav appears with a subtle slide-down on load (200ms delay)
- Background transitions from transparent to glass on scroll (threshold: 80px)
- "Join Waitlist" button has a subtle pulse glow animation (infinite, slow)

---

### Section 1: Hero

**Purpose:** First impression. Explain what Yapsy is. Capture attention.

**Layout:** Full viewport height. Split — left: copy, right: app mockup. Centred stack on mobile.

**Background:** Full-bleed background gradient (`#F6C4ED → #C798E8`) with subtle animated grain/noise texture overlay. Floating soft light circles (large, blurred) drift slowly in the background.

**Elements:**

**Left Column (copy):**
- Eyebrow: "Your AI daily companion" (small caps, accent colour, fade-in)
- Headline: **"Yap about your day.\nYapsy handles the rest."** (72px Plus Jakarta Sans Bold, `#191919`, line-by-line text reveal animation)
- Subheadline: "Talk to Yapsy at the end of your day. It tracks your tasks, captures your mood, and shows you patterns you'd never notice." (18px Open Sans, `#191919` at 70% opacity, fade-in after headline)
- CTA Group:
  - **"Join the Waitlist"** — Large pill button, primary gradient background, warm white text, hover: scale 1.05 + deeper glow shadow
  - "14-day free trial · No credit card" — Caption below CTA, #191919 at 50% opacity
- Social proof (below CTA):
  - Small avatars (3-4 stacked circles) + "200+ people already waiting" (dynamic count from backend if available, otherwise static)

**Right Column (visual):**
- App screenshot (the Dashboard Figma screen) inside a phone frame mockup
- Phone floats with a gentle bob animation (vertical oscillation, 4s loop, ease-in-out)
- Soft purple glow behind the phone (large radial gradient, blurred)
- 2-3 small UI cards "pop out" of the phone at angles (task card, mood badge, streak card) — positioned absolutely around the phone, each floating independently with different timings

**Animations:**
- Background gradient subtly shifts (hue-rotate + position, 20s loop)
- Floating light circles drift slowly (CSS or Framer Motion)
- Copy: staggered reveal — eyebrow (0ms), headline (200ms), sub (400ms), CTA (600ms), social proof (800ms)
- Phone: scales up from 0.8 → 1.0 with fade (600ms, spring easing)
- Pop-out cards: stagger in from behind phone (800ms, 1000ms, 1200ms)
- Scroll indicator: subtle animated chevron at bottom of viewport

---

### Section 2: Feature Showcase

**Purpose:** Explain the 3 core features.

**Layout:** Section title centred, then 3 feature cards in a row (stack vertically on mobile).

**Background:** Warm white (`#FFF4EA`) with very subtle radial gradient glow at centre.

**Section Title:**
- Eyebrow: "What Yapsy Does" (accent colour)
- Headline: **"Everything you need,\none conversation away."** (48px, `#191919`)

**Feature Cards (3 columns):**

Each card is a glassmorphism card with:
- Top: Gradient icon container (64px circle, primary gradient, icon inside)
- Title: Feature name (24px, Plus Jakarta Sans SemiBold)
- Description: 2 lines of copy (16px, Open Sans, `#191919` at 70%)
- Bottom: Small illustrative element or mini screenshot

**Card 1: 🎙️ Voice Check-ins**
- Icon: Microphone
- Title: "Talk, don't type"
- Description: "End your day with a natural conversation. Yapsy listens, understands, and acts on what you say."
- Visual: Mini voice orb illustration (gradient circle with pulse rings)

**Card 2: 📊 Mood Intelligence**
- Icon: Chart/Brain
- Title: "Patterns you'd miss"
- Description: "Yapsy spots mood trends, productivity patterns, and emotional triggers across weeks of data."
- Visual: Mini mood chart (stylised line graph with gradient fill)

**Card 3: ✅ Smart Tasks**
- Icon: Checkbox/Calendar
- Title: "Tasks that think"
- Description: "Mention a task in conversation and it appears in your calendar. Overdue? Yapsy rolls it forward."
- Visual: Mini task card stack illustration

**Animations:**
- Section title: fade + slide up on scroll-in (IntersectionObserver)
- Cards: stagger in from bottom — card 1 (0ms), card 2 (150ms), card 3 (300ms)
- Cards hover: lift up (translateY -8px) + shadow deepens + subtle gradient border appears
- Icons: gentle rotate + scale pulse on card hover

---

### Section 3: How It Works

**Purpose:** 3-step visual flow showing the daily experience.

**Layout:** Horizontal timeline on desktop, vertical on mobile. Each step with illustration + copy.

**Background:** Background gradient (`#F6C4ED → #C798E8`), rotated slightly or at a diagonal.

**Section Title:**
- Headline: **"3 minutes. Every night.\nThat's all it takes."** (48px, `#191919`)

**Steps (connected by an animated dotted/gradient line):**

**Step 1: "Yap about your day"**
- Illustration: Person with speech bubbles → phone with voice orb
- Description: "Open Yapsy and start talking. Tell it what happened, what you did, what you're feeling. No structure needed."

**Step 2: "Yapsy does the rest"**
- Illustration: AI brain processing → task cards + mood chart appearing
- Description: "Yapsy analyses your conversation — extracts tasks, scores your mood, finds themes, and spots patterns."

**Step 3: "Wake up smarter"**
- Illustration: Morning phone showing dashboard with insights
- Description: "Check your dashboard for insights, trends, and a journal that writes itself. See your week at a glance."

**Connecting Element:**
- A gradient line (or animated dots/particles) flows between the 3 steps horizontally
- On mobile: vertical line with steps stacked

**Animations:**
- Steps reveal on scroll: slide in from left (step 1), fade in (step 2), slide in from right (step 3)
- Connecting line animates as you scroll through the section (draws itself)
- Illustrations have subtle hover parallax (slight tilt based on cursor position)

---

### Section 4: App Preview / Interactive Showcase

**Purpose:** Show the actual app in action. Build desire.

**Layout:** Large centred phone mockup with multiple screens that auto-rotate (carousel) or shift on scroll.

**Background:** Dark section — `#191919` background with subtle grid/dot pattern.

**Elements:**
- Phone mockup (centred, large — 50% viewport on desktop)
- Inside the phone: auto-cycling screenshots (Dashboard → Tasks → Voice Session → Journal → Insights)
- Each screen transitions with a smooth crossfade or slide
- Floating annotation cards around the phone pointing to features:
  - "🔥 12-day streak" (pointing to streak badge)
  - "😊 Mood: 7/10" (pointing to mood area)
  - "✅ 3 done, 2 to go" (pointing to task summary)
- Below phone: Screen name indicator dots (like a carousel)

**Animations:**
- Phone slides up into view on scroll (parallax — moves slower than scroll)
- Screenshots auto-cycle every 4 seconds with crossfade
- Annotation cards float in from edges with stagger (1s after phone appears)
- Each annotation has a connecting line (thin gradient line) from card to phone area
- Subtle light leak / lens flare effect behind phone

---

### Section 5: Social Proof / Testimonials

**Purpose:** Build trust. Show that real people want this.

**Layout:** Centred section title + horizontally scrolling testimonial cards (auto-scroll + manual drag).

**Background:** Warm white (`#FFF4EA`).

**Section Title:**
- Headline: **"People are already excited"**

**Testimonial Cards (4-6, horizontally scrolling):**

Each card (glassmorphism, rounded):
- Quote text (italic, 18px Open Sans)
- Avatar (small circle) + Name + Title/Context
- Star rating or emoji reaction

For pre-launch, use quotes from:
- Beta testers / friends who've tried it
- Hackathon judges (MeritMind win context)
- Waitlist signups who gave feedback
- Can use placeholder/anonymised quotes initially

**Card Examples:**
- "I've tried every journaling app. Yapsy is the first one where I just... talk. And everything happens." — Sarah K, Beta Tester
- "The mood tracking is eerily accurate. After a week, it knew my stress triggers better than I did." — Raj M, Early User
- "Finally, a task app that doesn't make me feel guilty. Yapsy just rolls things forward without judgement." — Alex T, Waitlist Member

**Scrolling behaviour:**
- Auto-scroll (slow, continuous marquee)
- User can drag/swipe to browse
- Pause auto-scroll on hover/touch
- Loop infinitely

**Animations:**
- Cards have subtle tilt on hover (3D perspective transform)
- Marquee scroll is CSS-driven (GPU-accelerated)
- Section title fades in on scroll

---

### Section 6: Pricing

**Purpose:** Simple, transparent pricing. Reassure that there's a free trial.

**Layout:** Centred card with pricing details.

**Background:** Background gradient, subtle.

**Section Title:**
- Headline: **"Simple pricing.\nStart free."**

**Pricing Card (single, centred, glassmorphism, extra-large):**

```
┌──────────────────────────────────────────┐
│          🟣 Yapsy Pro                      │
│                                            │
│     🇬🇧 £5/month    🇮🇳 ₹99/month         │
│                                            │
│     14-day free trial included              │
│     No credit card required to start        │
│                                            │
│  ✨ Unlimited voice check-ins              │
│  📊 Full mood & productivity insights      │
│  ✅ Smart task management                   │
│  📖 AI-written daily journal               │
│  🔥 Streak tracking & weekly reports       │
│  🔒 Private & encrypted                    │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │       Join the Waitlist →           │   │
│  └────────────────────────────────────┘   │
│                                            │
│  Waitlist members get 1st month FREE 🎉    │
└──────────────────────────────────────────┘
```

**Feature list:** Each item has a gradient checkmark/emoji on the left, description on the right.

**Price display:** Two columns or toggle — UK (£5/mo) and India (₹99/mo). Auto-detect via locale if possible, default to £5 with India toggle.

**Bottom text:** "Waitlist members get their 1st month completely free" — highlighted in accent colour.

**Animations:**
- Card scales up from 0.9 → 1.0 on scroll-in
- Feature checkmarks stagger in (100ms delay each)
- CTA button has the signature pulse glow
- Price numbers count up from 0 on scroll-in (number ticker animation)

---

### Section 7: Waitlist CTA (Primary Conversion Section)

**Purpose:** THE main conversion point. Big, bold, impossible to miss.

**Layout:** Full-width, generous vertical padding. Centred content.

**Background:** Full primary gradient (`#FCB0F3 → #3D05DD`), diagonal or at slight angle. Floating light orbs/particles in background.

**Elements:**
- Headline: **"Ready to meet Yapsy?"** (48px, warm white, text shadow)
- Subheadline: "Join the waitlist and be first in line. First month free for early supporters." (18px, warm white at 80%)
- Email input + submit button (inline):
  - Input: Large rounded field, white background, placeholder: "your@email.com"
  - Button: "Join Waitlist" pill, `#191919` background, warm white text, inside the input or adjacent
  - On submit: Button text changes to "✓ You're in!" with a confetti micro-animation
- Below form:
  - "🔒 No spam. Unsubscribe anytime."
  - Waitlist count: "Join 200+ people already on the list"

**Success State (replaces form after submit):**
- Confetti animation (small, tasteful, 2s)
- "🎉 You're on the list!"
- "We'll email you when Yapsy is ready. Your first month is on us."
- Social share buttons: "Spread the word" → Twitter/X, LinkedIn, WhatsApp, Copy Link

**Animations:**
- Background particles float lazily
- Headline + sub: fade in on scroll
- Input field: subtle glow pulse on focus
- Submit: button width transitions, text crossfades to success
- Confetti: Lottie or canvas-based, triggered on successful submit

---

### Section 8: Footer

**Layout:** Full width, dark (`#191919` bg).

**Elements:**
- Left: Yapsy logo + tagline "Yap about your day. Yapsy handles the rest."
- Centre: Links — Privacy Policy · Terms · Contact (anchor or mailto)
- Right: Social icons — Twitter/X, LinkedIn, Instagram
- Bottom: "© 2026 Eightspheres Technologies" + "Made with 💜 in London"

**Animation:** Subtle — just a fade-in on scroll.

---

## 4. Waitlist Backend

### 4.1 Data Storage

**Option A (Simple — recommended for launch):** Use a third-party service:
- **Mailchimp** / **ConvertKit** / **Resend** for email capture + list management
- Embed their form or API call on submit
- Advantage: built-in email sequences, analytics, unsubscribe handling

**Option B (Custom):** Next.js API route + database:
```
POST /api/waitlist
Body: { email: string, source?: string, referral?: string }
Response: { success: true, position: number }
```
- Store in: Supabase, Planetscale, or even a Google Sheet (via API)
- Send confirmation email via Resend or SendGrid

**Recommended:** Option A with ConvertKit or Resend Audiences. Simpler, handles compliance (GDPR, CAN-SPAM), and lets you build email sequences for the launch blast.

### 4.2 Tracking & Analytics

- **Vercel Analytics** — page views, scroll depth, web vitals
- **Plausible** or **PostHog** — privacy-friendly event tracking
- Track: `waitlist_signup`, `scroll_depth_50`, `scroll_depth_100`, `cta_click`, `social_share`
- UTM parameter capture: store `utm_source`, `utm_medium`, `utm_campaign` with signup

### 4.3 Waitlist Count Display

- Show real count if using custom backend (query on page load)
- Or show static "200+" and update manually
- Number animates up (count ticker) when the section scrolls into view

---

## 5. Technical Architecture

### 5.1 Project Structure

```
yapsy-website/
├── app/
│   ├── layout.tsx                    # Root: fonts, metadata, analytics
│   ├── page.tsx                      # Single landing page (all sections)
│   ├── globals.css                   # Tailwind + custom properties + animations
│   ├── api/
│   │   └── waitlist/
│   │       └── route.ts              # POST handler for waitlist signup
│   ├── privacy/
│   │   └── page.tsx                  # Privacy policy (static)
│   └── terms/
│       └── page.tsx                  # Terms of service (static)
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                # Sticky nav with glass effect
│   │   ├── footer.tsx                # Footer
│   │   └── mobile-menu.tsx           # Slide-in mobile nav
│   ├── sections/
│   │   ├── hero.tsx                  # Section 1
│   │   ├── features.tsx              # Section 2
│   │   ├── how-it-works.tsx          # Section 3
│   │   ├── app-preview.tsx           # Section 4
│   │   ├── testimonials.tsx          # Section 5
│   │   ├── pricing.tsx               # Section 6
│   │   ├── waitlist-cta.tsx          # Section 7
│   │   └── section-wrapper.tsx       # Reusable scroll-animation wrapper
│   ├── ui/
│   │   ├── gradient-button.tsx       # Primary CTA button with glow
│   │   ├── glass-card.tsx            # Glassmorphism card component
│   │   ├── email-form.tsx            # Waitlist email input + submit
│   │   ├── phone-mockup.tsx          # Phone frame with screen content
│   │   ├── floating-element.tsx      # Wrapper for float/bob animation
│   │   ├── count-up.tsx              # Animated number ticker
│   │   ├── marquee.tsx               # Infinite scroll marquee
│   │   ├── particle-field.tsx        # Background floating particles
│   │   └── gradient-text.tsx         # Text with gradient fill
│   └── animations/
│       ├── scroll-reveal.tsx         # IntersectionObserver + Framer Motion
│       ├── parallax-layer.tsx        # Scroll-linked parallax wrapper
│       ├── stagger-children.tsx      # Staggered child animation wrapper
│       ├── text-reveal.tsx           # Line-by-line text animation
│       ├── magnetic-element.tsx      # Cursor-following magnetic effect
│       └── confetti.tsx              # Confetti celebration effect
├── lib/
│   ├── utils.ts                      # cn(), scroll helpers
│   ├── waitlist.ts                   # Waitlist API/service call
│   ├── analytics.ts                  # Event tracking helpers
│   └── constants.ts                  # Copy, feature lists, testimonials
├── public/
│   ├── images/
│   │   ├── app-screenshot-dashboard.png
│   │   ├── app-screenshot-tasks.png
│   │   ├── app-screenshot-voice.png
│   │   ├── app-screenshot-journal.png
│   │   ├── phone-frame.png           # Device mockup frame
│   │   └── og-image.png              # Open Graph social share image
│   ├── svg/
│   │   ├── logo.svg
│   │   ├── logo-wordmark.svg
│   │   ├── icon-mic.svg
│   │   ├── icon-chart.svg
│   │   ├── icon-task.svg
│   │   └── icon-shield.svg
│   └── lottie/
│       ├── orb-breathing.json        # Voice orb animation
│       └── confetti.json             # Celebration effect
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── .env.local
```

### 5.2 Key Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "lottie-react": "^2.4.0",
    "lenis": "^1.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0"
  }
}
```

### 5.3 Animation Stack

- **Framer Motion**: Primary animation library — scroll-triggered reveals, layout animations, gesture handling, shared layout transitions
- **Lenis**: Smooth scrolling (replaces native scroll for buttery parallax)
- **CSS animations**: Background gradient shifts, pulse glows, marquee scroll (GPU-accelerated, no JS needed)
- **Lottie**: Voice orb animation, confetti celebration

### 5.4 Performance Requirements

- **Lighthouse score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle size**: < 200KB JS (excluding images)

**Optimisation strategies:**
- Next.js Image component for all raster images (automatic WebP, lazy loading)
- Font preloading (Plus Jakarta Sans + Open Sans via next/font/google)
- Framer Motion `LazyMotion` with `domAnimation` features (tree-shakeable)
- Lottie loaded dynamically (React.lazy)
- Images: WebP format, responsive `srcSet`
- CSS-only animations where possible (prefer CSS over JS for simple loops)
- Intersection Observer for scroll triggers (no scroll event listeners)

---

## 6. SEO & Metadata

```typescript
// app/layout.tsx metadata
export const metadata: Metadata = {
  title: 'Yapsy — Your AI Daily Companion',
  description: 'Talk to Yapsy at the end of your day. It tracks your tasks, captures your mood, and shows you patterns you\'d never notice. Join the waitlist.',
  keywords: ['AI companion', 'mood tracker', 'voice journal', 'task management', 'daily check-in', 'mental health', 'productivity'],
  openGraph: {
    title: 'Yapsy — Yap about your day. Yapsy handles the rest.',
    description: 'Your AI-powered daily companion. Voice check-ins, mood tracking, smart tasks, and psychological insights.',
    url: 'https://yapsy.app',
    siteName: 'Yapsy',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yapsy — Your AI Daily Companion',
    description: 'Talk to Yapsy. It handles the rest.',
    images: ['/images/og-image.png'],
  },
};
```

---

## 7. Responsive Breakpoints

```
Mobile:    < 640px   — Stacked layout, smaller type, full-width cards
Tablet:    640-1024px — 2-column where applicable, adjusted spacing
Desktop:   > 1024px  — Full layout, max-width 1280px centred content
Large:     > 1440px  — Generous whitespace, larger hero elements
```

**Mobile-first approach.** Design for 375px width first, then scale up.

---

## 8. Accessibility

- Reduced motion: respect `prefers-reduced-motion` — disable parallax, reduce animations to simple fades
- Semantic HTML: proper heading hierarchy (h1 → h2 → h3), landmark regions
- Focus indicators: visible focus rings on all interactive elements
- Alt text: all images have descriptive alt text
- Contrast: all text meets WCAG AA (check `#191919` on gradient backgrounds)
- Skip to content link: hidden, visible on focus
- Form: email input has proper label, error states announced to screen readers

---

## 9. Environment Variables

```bash
# .env.local

# Waitlist provider (Resend / ConvertKit / Custom)
RESEND_API_KEY=re_xxx
WAITLIST_AUDIENCE_ID=xxx

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Vercel Analytics (auto-configured on Vercel)

# Site
NEXT_PUBLIC_SITE_URL=https://yapsy.app
```

---

## 10. Deployment

- **Host**: Vercel (automatic from GitHub)
- **Domain**: yapsy.app (configured in Vercel)
- **CDN**: Vercel Edge Network (automatic)
- **Analytics**: Vercel Analytics + PostHog
- **Monitoring**: Vercel Speed Insights

---

## 11. Page Summary

| Section | Content | Primary Animation |
|---------|---------|-------------------|
| Nav | Logo + links + CTA | Glass morph on scroll |
| Hero | Headline + CTA + phone mockup | Text reveal, phone float, card pop-outs |
| Features | 3 feature cards | Stagger in from bottom |
| How it Works | 3-step flow with timeline | Connected line draw, step reveals |
| App Preview | Phone carousel with annotations | Parallax phone, auto-cycling screens |
| Testimonials | Horizontal scrolling quotes | Marquee auto-scroll, tilt on hover |
| Pricing | Single plan card with features | Scale up, feature stagger, price ticker |
| Waitlist CTA | Email capture (main conversion) | Particle bg, confetti on submit |
| Footer | Logo + links + social + copyright | Simple fade in |