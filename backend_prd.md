# Yapsy — Backend Product Requirements Document

> **"Yap about your day. Yapsy handles the rest."**

**Project**: Yapsy — Voice-First Daily Companion App  
**Backend Stack**: NestJS (TypeScript) + PostgreSQL + TypeORM  
**Company**: Eightspheres Technologies (India)  
**Domain**: yapsy.app  
**Author**: Devansh  
**Date**: February 2026

---

## 1. System Overview

Yapsy's backend is a **NestJS monolithic API** that serves two clients through separate Swagger-documented API groups:

1. **Mobile API** (`/api/v1/mobile/*`) — Flutter app endpoints
2. **Admin API** (`/api/v1/admin/*`) — Next.js admin panel endpoints

Both share the same database, services, and business logic but have distinct authentication guards, rate limits, and documentation.

```
┌──────────────────────────────────────────────────────────────┐
│                        NestJS Backend                         │
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │  Mobile API Group    │    │  Admin API Group              │ │
│  │  /api/v1/mobile/*    │    │  /api/v1/admin/*              │ │
│  │  Swagger: /docs/mobile│   │  Swagger: /docs/admin         │ │
│  │  Guard: JwtAuthGuard  │   │  Guard: AdminJwtAuthGuard     │ │
│  │  Rate: 100 req/min    │   │  Rate: 300 req/min            │ │
│  └──────────┬───────────┘    └──────────────┬───────────────┘ │
│             └────────────┬───────────────────┘                 │
│                          ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Shared Service Layer                     │ │
│  │  AuthService · UsersService · TasksService                │ │
│  │  ConversationsService · JournalsService                   │ │
│  │  InsightsService · SubscriptionsService                   │ │
│  │  PromoCodesService · LLMService · ElevenLabsService       │ │
│  │  RazorpayService · NotificationsService                   │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                              ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL (TypeORM)                          │ │
│  │  users · tasks · journals · subscription_plans            │ │
│  │  promo_codes · user_promo_redemptions · mood_insights     │ │
│  │  notes · admin_users · webhook_events                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  External Services:                                           │
│  ├── ElevenLabs Conversational AI (voice sessions)            │
│  ├── Claude API (transcript analysis + tool-use)              │
│  ├── Razorpay (subscriptions + webhooks)                      │
│  └── Firebase Cloud Messaging (push notifications)            │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Project Structure

```
yapsy-api/
├── docker/
│   ├── Dockerfile                # Production multi-stage build
│   ├── Dockerfile.dev            # Development with hot-reload
│   └── docker-compose.yml        # Local dev: postgres + api + pgadmin
├── src/
│   ├── main.ts                   # Bootstrap + dual Swagger setup
│   ├── app.module.ts             # Root module
│   ├── config/
│   │   ├── configuration.ts      # Environment config factory
│   │   ├── database.config.ts    # TypeORM config
│   │   ├── swagger.config.ts     # Dual Swagger builder
│   │   └── validation.ts         # .env validation schema (Joi)
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── api-group.decorator.ts    # @MobileApi() / @AdminApi()
│   │   │   ├── current-user.decorator.ts # @CurrentUser() param decorator
│   │   │   └── subscription-guard.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── admin-jwt-auth.guard.ts
│   │   │   ├── subscription.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts  # Response envelope
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── api-response.dto.ts
│   │   └── enums/
│   │       ├── task-status.enum.ts
│   │       ├── task-priority.enum.ts
│   │       ├── subscription-status.enum.ts
│   │       ├── promo-type.enum.ts
│   │       ├── concern-level.enum.ts
│   │       └── mood-trend.enum.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts          # /api/v1/mobile/auth/*
│   │   │   ├── admin-auth.controller.ts    # /api/v1/admin/auth/*
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   ├── google-oauth.strategy.ts
│   │   │   │   └── apple-oauth.strategy.ts
│   │   │   └── dto/
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts          # /api/v1/mobile/users/*
│   │   │   ├── admin-users.controller.ts    # /api/v1/admin/users/*
│   │   │   └── entities/
│   │   │       ├── user.entity.ts
│   │   │       └── admin-user.entity.ts
│   │   ├── tasks/
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.controller.ts          # /api/v1/mobile/tasks/*
│   │   │   └── entities/
│   │   │       └── task.entity.ts
│   │   ├── conversations/
│   │   │   ├── conversations.module.ts
│   │   │   ├── conversations.service.ts
│   │   │   ├── conversations.controller.ts  # /api/v1/mobile/conversations/*
│   │   │   └── elevenlabs.service.ts
│   │   ├── journals/
│   │   │   ├── journals.module.ts
│   │   │   ├── journals.service.ts
│   │   │   ├── journals.controller.ts       # /api/v1/mobile/journals/*
│   │   │   ├── llm-processor.service.ts     # Claude API + tool-use
│   │   │   └── entities/
│   │   │       └── journal.entity.ts
│   │   ├── insights/
│   │   │   ├── insights.module.ts
│   │   │   ├── insights.service.ts
│   │   │   ├── insights.controller.ts       # /api/v1/mobile/insights/*
│   │   │   └── entities/
│   │   │       └── mood-insight.entity.ts
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.module.ts
│   │   │   ├── subscriptions.service.ts
│   │   │   ├── subscriptions.controller.ts  # /api/v1/mobile/subscriptions/*
│   │   │   ├── admin-subscriptions.controller.ts
│   │   │   ├── razorpay.service.ts
│   │   │   ├── webhook.controller.ts        # /api/v1/webhooks/razorpay
│   │   │   └── entities/
│   │   │       ├── subscription-plan.entity.ts
│   │   │       └── webhook-event.entity.ts
│   │   ├── promo-codes/
│   │   │   ├── promo-codes.module.ts
│   │   │   ├── promo-codes.service.ts
│   │   │   ├── promo-codes.controller.ts
│   │   │   ├── admin-promo-codes.controller.ts
│   │   │   └── entities/
│   │   │       ├── promo-code.entity.ts
│   │   │       └── user-promo-redemption.entity.ts
│   │   ├── notes/
│   │   │   ├── notes.module.ts
│   │   │   ├── notes.service.ts
│   │   │   ├── notes.controller.ts
│   │   │   └── entities/
│   │   │       └── note.entity.ts
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── dashboard.controller.ts
│   │       ├── analytics.controller.ts
│   │       ├── system.controller.ts
│   │       ├── dashboard.service.ts
│   │       ├── analytics.service.ts
│   │       └── system.service.ts
│   └── database/
│       ├── migrations/
│       ├── seeds/
│       │   ├── seed.ts
│       │   ├── admin-seed.ts
│       │   └── plan-seed.ts
│       └── data-source.ts
├── test/
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema — Entity Definitions

### 3.1 Enums

```typescript
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ROLLED_OVER = 'rolled_over',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SubscriptionStatus {
  FREE = 'free',
  PRO = 'pro',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  PAST_DUE = 'past_due',
}

export enum PromoType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  SET_PRICE = 'set_price',
}

export enum ConcernLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum MoodTrend {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
}

export enum PlanInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
}
```

### 3.2 Entity: users
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column({ nullable: true }) password_hash: string;
  @Column() name: string;
  @Column({ nullable: true }) avatar_url: string;
  @Column({ default: 'Asia/Kolkata' }) timezone: string;
  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.FREE })
  subscription_status: SubscriptionStatus;
  @Column({ nullable: true }) razorpay_subscription_id: string;
  @Column({ nullable: true }) razorpay_customer_id: string;
  @Column({ default: 0 }) current_streak: number;
  @Column({ default: 0 }) total_check_ins: number;
  @Column({ default: 0 }) weekly_check_in_count: number;
  @Column({ nullable: true, type: 'date' }) weekly_check_in_reset_date: Date;
  @Column({ nullable: true }) last_check_in_date: Date;
  @Column({ nullable: true }) fcm_token: string;
  @Column({ nullable: true }) refresh_token_hash: string;
  @Column({ nullable: true }) google_id: string;
  @Column({ nullable: true }) apple_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  @OneToMany(() => Task, task => task.user) tasks: Task[];
  @OneToMany(() => Journal, journal => journal.user) journals: Journal[];
  @OneToMany(() => Note, note => note.user) notes: Note[];
  @OneToMany(() => UserPromoRedemption, r => r.user) promo_redemptions: UserPromoRedemption[];
}
```

### 3.3 Entity: tasks
```typescript
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') user_id: string;
  @Column() title: string;
  @Column({ nullable: true, type: 'text' }) description: string;
  @Column({ type: 'date' }) scheduled_date: Date;
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING }) status: TaskStatus;
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM }) priority: TaskPriority;
  @Column({ nullable: true, type: 'uuid' }) rolled_from_id: string;
  @Column({ nullable: true }) completed_at: Date;
  @Column({ nullable: true }) source: string; // 'manual' | 'voice' | 'rollover'
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
  @DeleteDateColumn() deleted_at: Date;

  @ManyToOne(() => User, user => user.tasks) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Task, { nullable: true }) @JoinColumn({ name: 'rolled_from_id' }) rolled_from: Task;
  @OneToMany(() => Task, task => task.rolled_from) rolled_to: Task[];
}
```

### 3.4 Entity: journals
```typescript
@Entity('journals')
@Unique(['user_id', 'date'])
export class Journal {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') user_id: string;
  @Column({ type: 'date' }) date: Date;
  @Column({ nullable: true }) elevenlabs_conversation_id: string;
  @Column({ default: 0 }) duration_seconds: number;
  @Column({ type: 'jsonb', default: [] }) transcript: { role: string; text: string; timestamp: number }[];
  @Column({ type: 'text', nullable: true }) summary: string;
  @Column({ type: 'int', nullable: true }) mood_score: number;
  @Column({ nullable: true }) mood_label: string;
  @Column({ type: 'text', array: true, default: '{}' }) themes: string[];
  @Column({ type: 'text', array: true, default: '{}' }) wins: string[];
  @Column({ type: 'text', array: true, default: '{}' }) struggles: string[];
  @Column({ type: 'text', array: true, default: '{}' }) people_mentioned: string[];
  @Column({ type: 'enum', enum: ConcernLevel, default: ConcernLevel.LOW }) concern_level: ConcernLevel;
  @Column({ type: 'jsonb', default: [] }) actions_taken: { type: string; details: string; task_id?: string }[];
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  @ManyToOne(() => User, user => user.journals) @JoinColumn({ name: 'user_id' }) user: User;
}
```

### 3.5 Entity: notes
```typescript
@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') user_id: string;
  @Column('text') content: string;
  @Column({ nullable: true, type: 'date' }) follow_up_date: Date;
  @Column({ default: false }) is_resolved: boolean;
  @Column({ nullable: true }) source: string; // 'voice' | 'manual'
  @Column({ nullable: true, type: 'uuid' }) journal_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  @ManyToOne(() => User, user => user.notes) @JoinColumn({ name: 'user_id' }) user: User;
}
```

### 3.6 Entity: subscription_plans
```typescript
@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) razorpay_plan_id: string;
  @Column({ type: 'int' }) price_amount: number; // paise (₹249 = 24900)
  @Column({ default: 'INR' }) currency: string;
  @Column({ type: 'enum', enum: PlanInterval }) interval: PlanInterval;
  @Column({ type: 'jsonb', default: {} }) features: Record<string, any>;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
```

### 3.7 Entity: promo_codes
```typescript
@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) code: string;
  @Column({ type: 'enum', enum: PromoType }) type: PromoType;
  @Column({ type: 'int' }) value: number;
  @Column({ nullable: true, type: 'int' }) duration_months: number;
  @Column({ nullable: true, type: 'int' }) max_uses: number;
  @Column({ default: 0 }) current_uses: number;
  @Column({ type: 'timestamp' }) valid_from: Date;
  @Column({ nullable: true, type: 'timestamp' }) valid_until: Date;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  @OneToMany(() => UserPromoRedemption, r => r.promo_code) redemptions: UserPromoRedemption[];
}
```

### 3.8 Entity: user_promo_redemptions
```typescript
@Entity('user_promo_redemptions')
@Unique(['user_id', 'promo_code_id'])
export class UserPromoRedemption {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') user_id: string;
  @Column('uuid') promo_code_id: string;
  @Column() redeemed_at: Date;
  @Column({ nullable: true }) effective_until: Date;

  @ManyToOne(() => User, user => user.promo_redemptions) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => PromoCode, promo => promo.redemptions) @JoinColumn({ name: 'promo_code_id' }) promo_code: PromoCode;
}
```

### 3.9 Entity: mood_insights
```typescript
@Entity('mood_insights')
export class MoodInsight {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') user_id: string;
  @Column({ type: 'date' }) week_start: Date;
  @Column({ type: 'float', nullable: true }) avg_mood: number;
  @Column({ type: 'enum', enum: MoodTrend, nullable: true }) mood_trend: MoodTrend;
  @Column({ type: 'text', array: true, default: '{}' }) top_themes: string[];
  @Column({ type: 'float', nullable: true }) productivity_score: number;
  @Column({ type: 'text', nullable: true }) insight_text: string;
  @CreateDateColumn() created_at: Date;
}
```

### 3.10 Entity: admin_users
```typescript
@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password_hash: string;
  @Column() name: string;
  @Column({ type: 'enum', enum: AdminRole, default: AdminRole.MODERATOR }) role: AdminRole;
  @Column({ nullable: true }) refresh_token_hash: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
```

### 3.11 Entity: webhook_events
```typescript
@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() source: string;
  @Column() event_type: string;
  @Column({ type: 'jsonb' }) payload: Record<string, any>;
  @Column({ default: false }) processed: boolean;
  @Column({ nullable: true, type: 'text' }) error: string;
  @Column({ nullable: true }) razorpay_event_id: string;
  @CreateDateColumn() received_at: Date;
  @Column({ nullable: true }) processed_at: Date;
}
```

---

## 4. API Specification

### 4.1 Dual Swagger Setup

Two separate Swagger documents served at:
- **`/docs/mobile`** — Mobile API (Flutter app)
- **`/docs/admin`** — Admin API (Next.js dashboard)

Each has its own bearer auth, tags, and `operationIdFactory` prefix.

### 4.2 Mobile API Endpoints

#### Auth — `/api/v1/mobile/auth`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/register` | Register with email + password | Public |
| POST | `/login` | Login → access + refresh token | Public |
| POST | `/refresh` | Refresh access token | Refresh Token |
| POST | `/forgot-password` | Send reset email | Public |
| POST | `/reset-password` | Reset with token | Public |
| POST | `/google` | Google OAuth | Public |
| POST | `/apple` | Apple OAuth | Public |
| POST | `/logout` | Invalidate refresh token | JWT |

#### Users — `/api/v1/mobile/users`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/me` | Current user profile | JWT |
| PATCH | `/me` | Update profile | JWT |
| PATCH | `/me/fcm-token` | Update push token | JWT |
| DELETE | `/me` | Delete account | JWT |

#### Tasks — `/api/v1/mobile/tasks`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/` | Create task | JWT |
| GET | `/` | List (query: date, status, from, to) | JWT |
| GET | `/today` | Today's tasks | JWT |
| GET | `/overdue` | Overdue pending tasks | JWT |
| GET | `/upcoming` | Next 14 days | JWT |
| GET | `/calendar/:year/:month` | Calendar month tasks + mood | JWT |
| GET | `/:id` | Task detail | JWT |
| PATCH | `/:id` | Update task | JWT |
| PATCH | `/:id/complete` | Mark completed | JWT |
| POST | `/:id/rollover` | Rollover to new date | JWT |
| DELETE | `/:id` | Soft delete | JWT |

#### Conversations — `/api/v1/mobile/conversations`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/prepare` | ElevenLabs signed URL + config | JWT + Sub |
| POST | `/` | Save conversation → triggers LLM | JWT + Sub |
| GET | `/:id/status` | Processing status | JWT |

#### Journals — `/api/v1/mobile/journals`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | List entries (paginated) | JWT |
| GET | `/today` | Today's journal | JWT |
| GET | `/:id` | Full journal entry | JWT |
| GET | `/stats` | Mood stats for range | JWT |
| GET | `/search` | Search by keyword/theme | JWT + Pro |

#### Insights — `/api/v1/mobile/insights`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/mood` | Mood chart data (7/14/30d) | JWT |
| GET | `/themes` | Top themes | JWT |
| GET | `/streaks` | Current + longest streak | JWT |
| GET | `/weekly` | AI weekly insight | JWT + Pro |
| GET | `/productivity` | Task completion rates | JWT + Pro |

#### Subscriptions — `/api/v1/mobile/subscriptions`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/plans` | Available plans | JWT |
| GET | `/status` | Current sub status | JWT |
| POST | `/create` | Create Razorpay sub | JWT |
| POST | `/verify` | Verify payment signature | JWT |
| POST | `/cancel` | Cancel subscription | JWT |

#### Promo — `/api/v1/mobile/promo`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/validate/:code` | Validate promo code | JWT |
| POST | `/redeem` | Redeem promo code | JWT |

#### Notes — `/api/v1/mobile/notes`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | List notes | JWT |
| POST | `/` | Create note | JWT |
| PATCH | `/:id` | Update note | JWT |
| DELETE | `/:id` | Delete note | JWT |

#### Webhooks — `/api/v1/webhooks`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/razorpay` | Razorpay webhook (signature-verified) |

### 4.3 Admin API Endpoints

#### Admin Auth — `/api/v1/admin/auth`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/login` | Admin login | Public |
| POST | `/refresh` | Refresh admin token | Refresh |
| POST | `/logout` | Invalidate | Admin JWT |

#### Dashboard — `/api/v1/admin/dashboard`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/overview` | Total users, MRR, active subs, check-ins | Admin JWT |
| GET | `/growth` | User growth chart | Admin JWT |
| GET | `/check-ins` | Check-in volume chart | Admin JWT |
| GET | `/revenue` | MRR, churn, ARPU chart | Admin JWT |

#### Admin Users — `/api/v1/admin/users`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | List users (search, filter, paginate) | Admin JWT |
| GET | `/:id` | User detail | Admin JWT |
| GET | `/:id/journals` | User's journals | Admin JWT |
| GET | `/:id/tasks` | User's tasks | Admin JWT |
| PATCH | `/:id/subscription` | Override sub status | Super Admin |

#### Admin Subscriptions — `/api/v1/admin/subscriptions`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/plans` | List plans | Admin JWT |
| POST | `/plans` | Create plan | Super Admin |
| PATCH | `/plans/:id` | Update plan | Super Admin |
| DELETE | `/plans/:id` | Deactivate plan | Super Admin |
| GET | `/stats` | Sub stats | Admin JWT |

#### Admin Promo Codes — `/api/v1/admin/promo-codes`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | List with usage stats | Admin JWT |
| POST | `/` | Create promo | Admin JWT |
| PATCH | `/:id` | Update promo | Admin JWT |
| DELETE | `/:id` | Deactivate promo | Admin JWT |
| GET | `/:id/redemptions` | Redemption list | Admin JWT |

#### Admin Analytics — `/api/v1/admin/analytics`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/mood-distribution` | Aggregate mood dist | Admin JWT |
| GET | `/retention` | Retention cohorts | Admin JWT |
| GET | `/feature-usage` | Check-in freq, duration | Admin JWT |
| GET | `/conversion-funnel` | Free → Pro funnel | Admin JWT |
| GET | `/themes` | Global theme frequency | Admin JWT |

#### Admin System — `/api/v1/admin/system`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/health` | Health check + DB | Admin JWT |
| GET | `/costs` | ElevenLabs + Claude usage | Admin JWT |
| GET | `/errors` | Recent error log | Admin JWT |
| GET | `/webhooks` | Webhook event log | Admin JWT |
| POST | `/webhooks/:id/retry` | Retry failed webhook | Super Admin |

---

## 5. Response Envelope

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150, "hasMore": true }
}

// Error
{
  "success": false,
  "error": { "code": "TASK_NOT_FOUND", "message": "...", "statusCode": 404 }
}
```

---

## 6. Authentication & Guards

### Mobile Auth Flow
```
Register/Login → { access_token (15min), refresh_token (30d) }
access_token in Authorization: Bearer <token>
Expired? → POST /auth/refresh → new pair
refresh_token expired? → Force re-login
```

### Admin Auth
- Separate `admin_users` table with separate JWT secret
- Admin tokens cannot access mobile endpoints and vice versa
- Super Admin = full access; Moderator = read-heavy

### Guards
- `JwtAuthGuard` — validates mobile JWT
- `AdminJwtAuthGuard` — validates admin JWT
- `SubscriptionGuard` — checks `subscription_status === 'pro'`
- `SuperAdminGuard` — checks `admin.role === 'super_admin'`
- `ThrottleGuard` — 100/min mobile, 300/min admin

---

## 7. External Service Integrations

### 7.1 ElevenLabs Conversational AI
- `getSignedUrl(agentId)` — private agent access per session
- `buildSessionConfig(user, tasks)` — injects today's tasks into system prompt
- `getConversationTranscript(conversationId)` — backup transcript fetch

### 7.2 Claude API (LLM Processor)
- `processTranscript(transcript, userTasks, userId)` — returns insights + tool calls
- `generateWeeklyInsight(journals, tasks)` — narrative weekly summary

**Tool definitions for Claude:**
- `create_task(title, scheduled_date, priority)`
- `complete_task(task_id)`
- `reschedule_task(task_id, new_date, reason)`
- `add_note(content, follow_up_date?)`

### 7.3 Razorpay
- Plan CRUD, customer management, subscription lifecycle
- Webhook signature verification with `verifyWebhookSignature(body, signature)`
- Events: `subscription.activated`, `.charged`, `.pending`, `.halted`, `.cancelled`, `.paused`, `.resumed`

---

## 8. Business Logic Rules

### 8.1 Free Tier Limits
- 3 voice check-ins/week (resets Monday 00:00 user timezone)
- 7-day journal history (older hidden, not deleted)
- No weekly insights, journal search, or advanced analytics
- Tasks + calendar: unlimited

### 8.2 Streak Logic
```
After check-in:
  if last_check_in === yesterday → streak++
  else if last_check_in === today → no change
  else → streak = 1 (broken)
  last_check_in_date = today
  total_check_ins++
```

### 8.3 Weekly Counter
```
Before check-in:
  if today >= reset_date → reset count, set next Monday
  if free && count >= 3 → 402 (trigger paywall)
  else → count++, proceed
```

### 8.4 Task Rollover
```
Original task.status = 'rolled_over'
New task: same data, new date, rolled_from_id = original.id, source = 'rollover'
```

### 8.5 Promo Code Redemption
```
Validate: exists, active, within dates, under max_uses, user hasn't redeemed
Apply: percentage (% off) | flat (₹ off) | set_price (override)
Record: UserPromoRedemption, increment current_uses
```

---

## 9. Environment Variables

```bash
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=yapsy
DB_PASSWORD=yapsy_secret
DB_DATABASE=yapsy_dev

# JWT (Mobile)
JWT_SECRET=your-mobile-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-mobile-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# JWT (Admin)
ADMIN_JWT_SECRET=your-admin-jwt-secret
ADMIN_JWT_EXPIRES_IN=1h
ADMIN_JWT_REFRESH_SECRET=your-admin-refresh-secret
ADMIN_JWT_REFRESH_EXPIRES_IN=7d

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_AGENT_ID=your-agent-id

# Claude / Anthropic
ANTHROPIC_API_KEY=your-anthropic-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=yapsy-prod
FIREBASE_PRIVATE_KEY=your-firebase-key
FIREBASE_CLIENT_EMAIL=firebase-admin@yapsy-prod.iam.gserviceaccount.com

# Redis (optional, for rate limiting / queues)
REDIS_HOST=localhost
REDIS_PORT=6379

# Admin Seed
ADMIN_DEFAULT_EMAIL=admin@yapsy.app
ADMIN_DEFAULT_PASSWORD=change-me-on-first-login

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:8080

# Logging
LOG_LEVEL=debug
```

---

## 10. Non-Functional Requirements

### Performance
- API response time < 200ms for CRUD operations
- LLM processing < 10s (async, client polls for status)
- Webhook processing < 5s
- Rate limits: 100 req/min mobile, 300 req/min admin

### Security
- Passwords: bcrypt (12 rounds)
- JWT RS256 or HS256 with separate secrets per client
- Razorpay webhook HMAC SHA256 signature verification
- All DB queries parameterised (TypeORM handles this)
- Soft delete for user accounts (30-day retention, then hard delete via cron)
- Input validation on all DTOs via class-validator
- Helmet middleware for HTTP headers

### Reliability
- Webhook events logged before processing (idempotent handlers)
- Retry queue for failed LLM processing
- Transaction wrapping for journal creation + task mutations
- Health check endpoint for load balancer

### Observability
- Request/response logging interceptor
- Structured JSON logging (Winston or Pino)
- Error tracking with stack traces stored in DB
- API cost tracking (ElevenLabs + Claude usage per user)