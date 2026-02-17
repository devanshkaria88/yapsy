# Yapsy Admin Panel — Product Requirements Document

> **Internal dashboard for managing Yapsy's users, subscriptions, analytics, and system health.**

**Project**: Yapsy Admin Panel  
**Stack**: Next.js 16+ (App Router) · TypeScript · TailwindCSS · shadcn/ui  
**Backend**: Yapsy NestJS API (`/api/v1/admin/*`) — Swagger at `/docs/admin`  
**Author**: Devansh  
**Date**: February 2026

---

## 1. Overview

The Yapsy Admin Panel is an internal-only web dashboard used by the Yapsy team to monitor business health, manage users and subscriptions, create promo campaigns, and track system costs. It consumes the Admin API group from the Yapsy NestJS backend.

**Users of this panel:**
- **Super Admin** — Full access: CRUD plans, override subscriptions, retry webhooks, manage other admins
- **Moderator** — Read-heavy: view dashboard, users, analytics. Cannot modify plans or override subscriptions.

**Not a public-facing product.** No SEO, no marketing pages, no public routes. Every route is behind admin authentication.

---

## 2. Architecture

```
┌───────────────────────────────────────────────────┐
│              Yapsy Admin Panel                      │
│              Next.js 16+ (App Router)              │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Middleware: Auth check on every /dashboard/*  │ │
│  └───────────────────────────┬───────────────────┘ │
│                               │                     │
│  ┌────────────────────────────┴──────────────────┐ │
│  │              Page Layout                       │ │
│  │  ┌──────────┐  ┌───────────────────────────┐  │ │
│  │  │ Sidebar  │  │  Main Content Area        │  │ │
│  │  │          │  │                           │  │ │
│  │  │ Dashboard│  │  Server Components for    │  │ │
│  │  │ Users    │  │  initial data load        │  │ │
│  │  │ Subs     │  │                           │  │ │
│  │  │ Promos   │  │  Client Components for    │  │ │
│  │  │ Analytics│  │  charts, tables, forms    │  │ │
│  │  │ System   │  │                           │  │ │
│  │  └──────────┘  └───────────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
│                               │                     │
│                               ▼                     │
│  ┌────────────────────────────────────────────────┐ │
│  │  API Client (fetch wrapper)                    │ │
│  │  Base URL: NEXT_PUBLIC_API_URL                 │ │
│  │  Auth: Bearer token from cookie/session        │ │
│  │  Auto-refresh on 401                           │ │
│  └────────────────────────────┬───────────────────┘ │
└───────────────────────────────┼─────────────────────┘
                                │
                                ▼
                 NestJS Backend /api/v1/admin/*
                 Swagger: /docs/admin
```

---

## 3. Project Structure

```
yapsy-admin/
├── app/
│   ├── layout.tsx                    # Root layout (font, theme provider)
│   ├── globals.css                   # Tailwind base + shadcn variables
│   ├── (auth)/
│   │   ├── layout.tsx                # Centered auth layout (no sidebar)
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   └── forgot-password/
│   │       └── page.tsx              # (Optional) forgot password
│   └── (dashboard)/
│       ├── layout.tsx                # Dashboard shell: sidebar + topbar + main
│       ├── page.tsx                  # Dashboard overview (redirects or default)
│       ├── dashboard/
│       │   └── page.tsx              # Main dashboard: KPIs + charts
│       ├── users/
│       │   ├── page.tsx              # User list (searchable data table)
│       │   └── [id]/
│       │       └── page.tsx          # User detail: profile, journals, tasks, sub
│       ├── subscriptions/
│       │   ├── page.tsx              # Subscription stats + plan management
│       │   └── plans/
│       │       └── page.tsx          # Plan CRUD table
│       ├── promo-codes/
│       │   ├── page.tsx              # Promo code list + create form
│       │   └── [id]/
│       │       └── page.tsx          # Promo detail: redemptions list
│       ├── analytics/
│       │   ├── page.tsx              # Analytics overview
│       │   ├── retention/
│       │   │   └── page.tsx          # Retention cohort view
│       │   ├── conversion/
│       │   │   └── page.tsx          # Free → Pro funnel
│       │   └── mood/
│       │       └── page.tsx          # Mood distribution + global themes
│       └── system/
│           ├── page.tsx              # System health overview
│           ├── costs/
│           │   └── page.tsx          # API costs (ElevenLabs + Claude)
│           ├── errors/
│           │   └── page.tsx          # Error log table
│           └── webhooks/
│               └── page.tsx          # Webhook event log + retry
├── components/
│   ├── ui/                           # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── chart.tsx                 # shadcn/ui charts (Recharts wrapper)
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx               # Collapsible sidebar navigation
│   │   ├── topbar.tsx                # Top bar: breadcrumbs, admin name, logout
│   │   ├── breadcrumbs.tsx           # Auto-generated from route
│   │   └── mobile-nav.tsx            # Sheet-based mobile sidebar
│   ├── dashboard/
│   │   ├── kpi-card.tsx              # Stat card with icon, value, trend
│   │   ├── user-growth-chart.tsx     # Line chart: new users over time
│   │   ├── revenue-chart.tsx         # Area chart: MRR over time
│   │   ├── checkin-volume-chart.tsx   # Bar chart: daily check-ins
│   │   └── recent-signups-table.tsx  # Compact recent users table
│   ├── users/
│   │   ├── users-data-table.tsx      # Full data table with search/filter
│   │   ├── user-profile-card.tsx     # User profile summary
│   │   ├── user-journals-list.tsx    # User's journal entries
│   │   ├── user-tasks-list.tsx       # User's task history
│   │   └── user-subscription-card.tsx # Sub status + override action
│   ├── subscriptions/
│   │   ├── plans-table.tsx           # Plan CRUD table
│   │   ├── plan-form-dialog.tsx      # Create/edit plan modal
│   │   └── sub-stats-cards.tsx       # Active, churned, conversion stats
│   ├── promo/
│   │   ├── promo-table.tsx           # Promo codes data table
│   │   ├── promo-form-dialog.tsx     # Create/edit promo modal
│   │   └── redemptions-table.tsx     # Who redeemed a specific code
│   ├── analytics/
│   │   ├── retention-heatmap.tsx     # Cohort retention heatmap
│   │   ├── conversion-funnel.tsx     # Funnel visualisation
│   │   ├── mood-distribution.tsx     # Histogram of mood scores
│   │   └── themes-cloud.tsx          # Top themes bar chart or cloud
│   └── system/
│       ├── health-status.tsx         # Green/red status indicators
│       ├── cost-breakdown.tsx        # API cost charts
│       ├── error-log-table.tsx       # Errors with stack trace expand
│       └── webhook-log-table.tsx     # Webhook events + retry button
├── lib/
│   ├── api-client.ts                 # Fetch wrapper with auth, refresh, error handling
│   ├── auth.ts                       # Login, logout, token storage, refresh logic
│   ├── utils.ts                      # cn(), formatCurrency(), formatDate(), etc.
│   ├── types/
│   │   ├── api.ts                    # API response envelope types
│   │   ├── user.ts                   # User, AdminUser interfaces
│   │   ├── task.ts                   # Task interface + enums
│   │   ├── journal.ts                # Journal interface
│   │   ├── subscription.ts           # Plan, SubscriptionStatus
│   │   ├── promo.ts                  # PromoCode, PromoType
│   │   ├── insight.ts                # MoodInsight, MoodTrend
│   │   ├── analytics.ts              # Chart data types
│   │   └── system.ts                 # Health, costs, errors, webhooks
│   └── hooks/
│       ├── use-api.ts                # Generic SWR/React Query hook wrapper
│       ├── use-auth.ts               # Auth state hook
│       ├── use-debounce.ts           # Debounced search
│       └── use-pagination.ts         # Table pagination state
├── middleware.ts                      # Protect /dashboard/* routes, redirect if no token
├── next.config.ts
├── tailwind.config.ts
├── components.json                   # shadcn/ui config
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 4. Screens & Pages

### 4.1 Login Page (`/login`)

**Layout:** Centered card on full-screen background, no sidebar.

**Elements:**
- Yapsy logo (small, above card)
- "Admin Portal" subtitle
- Email input
- Password input (show/hide toggle)
- "Log In" button (full width)
- Error toast on invalid credentials
- Loading spinner on submit

**API:** `POST /api/v1/admin/auth/login`
**On success:** Store access_token + refresh_token in httpOnly cookies or secure localStorage → redirect to `/dashboard`

---

### 4.2 Dashboard (`/dashboard`)

**Purpose:** At-a-glance business health. The first thing an admin sees.

**Layout:** 4 KPI cards on top, 2 charts middle row, 1 table bottom.

**KPI Cards (top row, 4 columns):**

| Card | Value | Trend | Icon |
|------|-------|-------|------|
| Total Users | 1,247 | +12% this month | Users icon |
| Active Subscribers | 342 | +8% this month | CreditCard icon |
| MRR | ₹85,158 | +₹4,200 vs last month | IndianRupee icon |
| Check-ins Today | 89 | vs 72 yesterday | Mic icon |

Each card: large number, subtitle, trend arrow (green up / red down), sparkline optional.

**API:** `GET /api/v1/admin/dashboard/overview`

**Charts (middle row, 2 columns):**

1. **User Growth** (left) — Line chart, last 30 days, daily new signups
   - API: `GET /api/v1/admin/dashboard/growth?period=30d`
   - Toggle: 7D / 30D / 90D

2. **Revenue** (right) — Area chart, MRR over last 6 months
   - API: `GET /api/v1/admin/dashboard/revenue?period=6m`
   - Show MRR line + churn annotations

**Bottom Section:**

3. **Recent Signups** — Compact table showing last 10 users
   - Columns: Name, Email, Signed Up, Status (badge), Streak
   - Click row → navigate to `/users/{id}`

**Check-in Volume** — Bar chart, last 14 days
- API: `GET /api/v1/admin/dashboard/check-ins?period=14d`
- Each bar = daily check-in count

---

### 4.3 Users (`/users`)

**Purpose:** Search, filter, and view all Yapsy users.

**Elements:**
- Search bar (debounced, searches name + email)
- Filter dropdowns:
  - Subscription: All / Free / Pro / Cancelled
  - Sort: Newest / Oldest / Most Check-ins / Longest Streak
- Data table:
  - Columns: Avatar+Name, Email, Plan (badge), Streak 🔥, Check-ins, Joined, Last Active
  - Pagination: 20 per page
  - Click row → `/users/{id}`

**API:** `GET /api/v1/admin/users?search=&status=&sort=&page=&limit=`

---

### 4.4 User Detail (`/users/[id]`)

**Purpose:** Deep view into a single user's activity and data.

**Layout:** 3-column top section + tabbed content below.

**Top Section (3 cards):**

1. **Profile Card**
   - Avatar, name, email, timezone
   - Joined date, last active
   - FCM token status (connected / not)

2. **Subscription Card**
   - Current plan badge (Free / Pro)
   - Razorpay subscription ID (linked)
   - If Pro: next billing date, amount, promo applied
   - Super Admin only: "Override Status" dropdown (free/pro/cancelled)

3. **Stats Card**
   - Current streak: 🔥 12
   - Total check-ins: 47
   - Avg mood score: 6.8
   - This week check-ins: 2/3 (free) or 5 (pro)

**Tabbed Content:**

**Tab 1: Journals**
- Chronological list of journal entries
- Each row: Date, Mood (badge + score), Summary preview, Duration
- Click → expand inline to show full journal (themes, wins, struggles, actions)
- API: `GET /api/v1/admin/users/{id}/journals`

**Tab 2: Tasks**
- Task list with status badges
- Columns: Title, Date, Status (badge: pending/completed/rolled_over), Priority, Source
- API: `GET /api/v1/admin/users/{id}/tasks`

**Tab 3: Mood Trend**
- Line chart of user's mood over time
- Uses same data format as mobile insights
- Shows themes below chart

---

### 4.5 Subscriptions (`/subscriptions`)

**Purpose:** Subscription health metrics and plan management.

**Top Section: Stats Cards (3 columns):**
- Active Subscribers: count + % of total users
- Churned This Month: count + trend
- Conversion Rate: Free → Pro % + trend

**API:** `GET /api/v1/admin/subscriptions/stats`

**Bottom Section: Plan Management Table**
- Columns: Plan Name, Price, Interval, Razorpay ID, Active (toggle), Actions
- "Create Plan" button → opens dialog
- Edit button → opens dialog pre-filled
- Deactivate button → confirmation dialog

**API:**
- `GET /api/v1/admin/subscriptions/plans`
- `POST /api/v1/admin/subscriptions/plans`
- `PATCH /api/v1/admin/subscriptions/plans/{id}`
- `DELETE /api/v1/admin/subscriptions/plans/{id}`

**Plan Form Dialog:**
- Plan name input
- Price input (₹, converts to paise on submit)
- Interval select: Monthly / Yearly
- Features JSON editor (or structured checkboxes)
- Active toggle
- Save / Cancel buttons

---

### 4.6 Promo Codes (`/promo-codes`)

**Purpose:** Create and manage promotional codes.

**Elements:**
- "Create Promo Code" button (top right) → opens dialog
- Data table:
  - Columns: Code, Type (badge), Value, Duration, Uses (current/max), Valid Until, Status, Actions
  - Status badge: Active (green) / Expired (grey) / Maxed Out (amber)
  - Click row → `/promo-codes/{id}` for redemption details

**API:** `GET /api/v1/admin/promo-codes`

**Create/Edit Promo Dialog:**
- Code input (auto-uppercase, alphanumeric)
- Type select: Percentage / Flat Discount / Set Price
- Value input (% or ₹ based on type)
- Duration input (months)
- Max uses input (0 = unlimited)
- Valid from date picker
- Valid until date picker (optional)
- Active toggle

---

### 4.7 Promo Code Detail (`/promo-codes/[id]`)

**Purpose:** See who redeemed a specific code.

**Top: Promo Summary Card**
- Code, type, value, duration, uses, validity

**Bottom: Redemptions Table**
- Columns: User (name + email), Redeemed At, Effective Until
- Click user → navigate to `/users/{id}`

**API:** `GET /api/v1/admin/promo-codes/{id}/redemptions`

---

### 4.8 Analytics (`/analytics`)

**Tabs or sub-pages:**

**4.8.1 Retention (`/analytics/retention`)**
- Cohort retention heatmap
- Rows = signup week, Columns = week 1, 2, 3...
- Cells = % of cohort still active
- Colour intensity = retention strength
- API: `GET /api/v1/admin/analytics/retention`

**4.8.2 Conversion (`/analytics/conversion`)**
- Funnel visualisation:
  - Signed Up → First Check-in → 3+ Check-ins → Pro Subscription
- Each step: count + drop-off %
- API: `GET /api/v1/admin/analytics/conversion-funnel`

**4.8.3 Mood (`/analytics/mood`)**
- Mood score distribution histogram (1-10, bar chart)
- Average mood by day of week (grouped bar)
- Top 20 themes (horizontal bar chart, sorted by frequency)
- API: `GET /api/v1/admin/analytics/mood-distribution`, `GET /api/v1/admin/analytics/themes`

**4.8.4 Feature Usage (`/analytics` default)**
- Cards: Avg check-in duration, Avg check-ins/user/week, % using task management
- API: `GET /api/v1/admin/analytics/feature-usage`

---

### 4.9 System (`/system`)

**4.9.1 Health (`/system` default)**
- Status indicators (green dot / red dot):
  - API Server: responding / down
  - Database: connected / error
  - Redis: connected / error
  - ElevenLabs: reachable / error
  - Razorpay: reachable / error
- Last checked timestamp
- API: `GET /api/v1/admin/system/health`

**4.9.2 API Costs (`/system/costs`)**
- ElevenLabs usage:
  - Total voice minutes this month
  - Cost estimate
  - Per-user average
- Claude API usage:
  - Total tokens this month (input + output)
  - Cost estimate
  - Per-journal average
- Chart: daily cost over last 30 days (stacked bar: ElevenLabs + Claude)
- API: `GET /api/v1/admin/system/costs`

**4.9.3 Error Log (`/system/errors`)**
- Data table:
  - Columns: Timestamp, Error Code, Message, Endpoint, Stack (expandable)
  - Filter: severity, date range
  - Sorted newest first
- API: `GET /api/v1/admin/system/errors`

**4.9.4 Webhooks (`/system/webhooks`)**
- Data table:
  - Columns: Received At, Event Type, Source, Processed (✅/❌), Error (if any)
  - Expand row → full JSON payload viewer
  - Failed rows: "Retry" button (Super Admin only)
- API: `GET /api/v1/admin/system/webhooks`
- Retry: `POST /api/v1/admin/system/webhooks/{id}/retry`

---

## 5. Sidebar Navigation

```
┌─────────────────────────┐
│  🟣 Yapsy Admin         │
│                         │
│  📊 Dashboard           │
│  👥 Users               │
│  💳 Subscriptions       │
│  🏷️ Promo Codes         │
│  📈 Analytics           │
│     ├─ Overview         │
│     ├─ Retention        │
│     ├─ Conversion       │
│     └─ Mood & Themes    │
│  ⚙️ System              │
│     ├─ Health           │
│     ├─ API Costs        │
│     ├─ Error Log        │
│     └─ Webhooks         │
│                         │
│  ─────────────────────  │
│  Admin Name             │
│  role: super_admin      │
│  [Logout]               │
└─────────────────────────┘
```

- Collapsible on desktop (icon-only mode)
- Sheet overlay on mobile (hamburger trigger)
- Active route highlighted
- Sub-pages show as nested items under parent

---

## 6. Component Library (shadcn/ui)

### Required shadcn/ui components:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label table dialog \
  dropdown-menu badge tabs select toast skeleton avatar \
  separator sheet tooltip popover command calendar \
  form switch textarea chart alert alert-dialog \
  pagination breadcrumb collapsible
```

### Chart Library
Use **shadcn/ui charts** (built on Recharts):
- `LineChart` — user growth, mood trends
- `AreaChart` — revenue/MRR
- `BarChart` — check-in volume, themes, mood distribution
- Custom heatmap for retention cohorts (grid of `<div>` with bg-opacity)

### Data Table Pattern
Use `@tanstack/react-table` with shadcn/ui table components:
- Server-side pagination (API handles offset/limit)
- Debounced search input
- Column header sorting
- Filter dropdowns
- Row click → navigate to detail
- Loading skeleton rows

---

## 7. API Client

```typescript
// lib/api-client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  // Set tokens (called after login)
  setTokens(access: string, refresh: string): void;

  // Clear tokens (called on logout)
  clearTokens(): void;

  // Generic fetch with auth header
  async request<T>(
    method: string,
    path: string,
    options?: { body?: any; params?: Record<string, string> }
  ): Promise<ApiResponse<T>>;

  // Auto-refresh on 401
  private async refreshAccessToken(): Promise<boolean>;

  // Convenience methods
  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>>;
  async post<T>(path: string, body?: any): Promise<ApiResponse<T>>;
  async patch<T>(path: string, body?: any): Promise<ApiResponse<T>>;
  async delete<T>(path: string): Promise<ApiResponse<T>>;
}

export const api = new ApiClient();
```

### API Response Types
```typescript
// lib/types/api.ts

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}
```

---

## 8. Authentication Flow

```
1. Admin visits /dashboard/* (any protected route)
2. middleware.ts checks for access_token cookie
3. No token → redirect to /login
4. Has token → allow through
5. Page loads → API call with Bearer token
6. 401 response → api-client auto-refreshes
7. Refresh fails → clear tokens, redirect to /login
8. Refresh succeeds → retry original request
```

### Token Storage
- **Access token**: stored in memory (ApiClient instance) + httpOnly cookie (for middleware SSR check)
- **Refresh token**: httpOnly cookie only
- On page refresh: middleware reads cookie, client-side rehydrates from cookie or calls refresh

### Role-Based UI
```typescript
// Conditionally render based on admin role
const { admin } = useAuth();

{admin.role === 'super_admin' && (
  <Button onClick={overrideSubscription}>Override Status</Button>
)}
```

Elements hidden for moderators (not just disabled):
- Plan create/edit/delete buttons
- Subscription override dropdown
- Webhook retry button
- Any destructive action

---

## 9. Design System

### Theme (shadcn/ui CSS variables)

```css
/* globals.css — Yapsy admin theme */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --primary: 263 70% 58%;        /* #7C3AED — Yapsy purple */
    --primary-foreground: 0 0% 100%;
    --secondary: 20 5.9% 96.1%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 20 5.9% 96.1%;
    --muted-foreground: 25 5.3% 44.7%;
    --accent: 37 91% 55%;          /* #F59E0B — Yapsy amber */
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 263 70% 58%;
    --radius: 0.5rem;

    /* Chart colours */
    --chart-1: 263 70% 58%;        /* Purple — primary metric */
    --chart-2: 37 91% 55%;         /* Amber — secondary metric */
    --chart-3: 172 66% 50%;        /* Teal — success/positive */
    --chart-4: 0 84% 60%;          /* Red — danger/negative */
    --chart-5: 215 20% 65%;        /* Slate — neutral */
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 0 0% 95%;
    --card: 24 9.8% 10%;
    --card-foreground: 0 0% 95%;
    --primary: 263 70% 65%;
    --primary-foreground: 0 0% 100%;
    --secondary: 24 9.8% 14%;
    --secondary-foreground: 0 0% 95%;
    --muted: 24 9.8% 14%;
    --muted-foreground: 25 5.3% 55%;
    --accent: 37 91% 55%;
    --accent-foreground: 0 0% 100%;
    --border: 24 9.8% 18%;
    --input: 24 9.8% 18%;
    --ring: 263 70% 65%;
  }
}
```

### Badge Variants (subscription status)
```
Free     → default (grey)
Pro      → purple (primary)
Cancelled → destructive (red)
Paused   → amber (warning)
Past Due → orange (warning)
```

### Mood Score Colours
```
1-2  → destructive (red)
3-4  → orange
5-6  → amber/yellow
7-8  → green
9-10 → emerald/bright green
```

### Table Row Density
- Default: comfortable (h-12 rows)
- Data-heavy pages (errors, webhooks): compact (h-10 rows)
- Always zebra-striped for readability

---

## 10. Environment Variables

```bash
# .env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_NAME=Yapsy Admin

# Auth cookie config
AUTH_COOKIE_NAME=yapsy_admin_token
AUTH_COOKIE_MAX_AGE=86400
```

---

## 11. Key UX Patterns

### Loading States
- **Initial page load**: Skeleton components matching data shape (shadcn Skeleton)
- **Table loading**: Skeleton rows (5 rows of grey bars)
- **Chart loading**: Skeleton rectangle matching chart dimensions
- **Action in progress**: Button shows spinner + disabled state

### Empty States
- **Users table (no results)**: "No users match your search. Try different filters."
- **No journals for user**: "This user hasn't done any check-ins yet."
- **No promo codes**: "No promo codes created yet. Create your first one."
- Each with a relevant icon and a CTA if applicable.

### Error States
- **API error**: Toast notification (destructive variant) with error message
- **Network error**: Toast with "Connection lost. Check your network."
- **Auth error (401 after refresh fails)**: Auto-redirect to /login with toast "Session expired. Please log in again."

### Confirmations
Use `AlertDialog` (shadcn) for destructive actions:
- Deactivate plan → "Are you sure? This will prevent new subscriptions to this plan."
- Override subscription → "Override {name}'s status to {new_status}?"
- Retry webhook → "Retry processing this webhook event?"

### Success Feedback
- Toast (default variant) for successful mutations: "Plan created successfully", "Promo code saved"
- Brief (3 seconds auto-dismiss)

---

## 12. Page Count Summary

| Section | Pages | Notes |
|---------|-------|-------|
| Auth | 1 | Login |
| Dashboard | 1 | KPIs + charts + recent table |
| Users | 2 | List + Detail (with tabs) |
| Subscriptions | 2 | Stats/overview + Plans table |
| Promo Codes | 2 | List + Detail (redemptions) |
| Analytics | 4 | Overview, Retention, Conversion, Mood |
| System | 4 | Health, Costs, Errors, Webhooks |
| **Total** | **16 pages** | + dialogs/modals for forms |

---

## 13. Non-Functional Requirements

### Performance
- Pages should load under 1 second (dashboard under 2s with charts)
- Tables server-side paginated (never load full dataset client-side)
- Debounce search inputs (300ms)
- Charts render after page shell loads (progressive)

### Security
- All routes behind middleware auth check
- Tokens in httpOnly cookies (not localStorage)
- Role checks both client-side (UI hiding) and server-side (API rejects)
- No sensitive data in URL params
- CSRF protection via SameSite cookie attribute

### Browser Support
- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Desktop only (admin panel is not mobile-optimised, but should not break on tablet)

### Accessibility
- Keyboard navigable (shadcn/ui handles most)
- Proper aria-labels on icon-only buttons
- Focus indicators visible
- Colour contrast meets WCAG AA