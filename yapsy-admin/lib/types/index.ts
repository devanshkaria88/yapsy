// ============================================================
// Yapsy Admin — Type Definitions
// Aligned with OpenAPI spec from /docs/admin-json
// Generated schema lives at ./api-schema.ts
// ============================================================

export type { paths, components, operations } from "./api-schema";

// --- API Envelope ---

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// --- Auth (matches AdminAuthResponseDto) ---

export type AdminRole = "super_admin" | "moderator";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// --- Dashboard ---

export interface DashboardOverview {
  total_users: number;
  active_pro: number;
  mrr: number;
  total_check_ins: number;
  active_today: number;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
}

export interface RevenueDataPoint {
  month: string;
  mrr: number;
  churn: number;
}

// --- Users ---

export type SubscriptionStatus =
  | "free"
  | "pro"
  | "cancelled"
  | "paused"
  | "past_due";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  last_active: string;
  check_in_count: number;
}

export interface UserDetail extends User {
  phone: string | null;
  timezone: string;
  streak_current: number;
  streak_longest: number;
  total_journals: number;
  total_tasks: number;
  avg_mood: number;
  subscription: {
    plan_id: string;
    plan_name: string;
    status: SubscriptionStatus;
    started_at: string;
    expires_at: string | null;
    razorpay_subscription_id: string | null;
  } | null;
}

export interface Journal {
  id: string;
  date: string;
  summary: string;
  mood_score: number;
  themes: string[];
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

// --- Subscriptions (matches CreatePlanDto / response) ---

export interface Plan {
  id: string;
  name: string;
  price_amount: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: Record<string, unknown>;
  is_active: boolean;
  razorpay_plan_id: string | null;
  created_at: string;
}

export interface SubscriptionStats {
  total_pro: number;
  total_free: number;
  total_cancelled: number;
  mrr_paise: number;
  mrr_inr: string;
}

// --- Promo Codes (matches CreatePromoDto) ---

export type PromoType = "percentage" | "flat" | "set_price";

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  duration_months: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  redeemed_at: string;
}

// --- Analytics ---

export interface MoodDistribution {
  low: number;
  medium: number;
  high: number;
  total: number;
}

export interface CohortRow {
  cohort_month: string;
  total_users: number;
  retained_users: number;
  rate: number;
}

export interface FeatureUsage {
  avg_check_ins_per_user: number;
  avg_duration: number;
  total_conversations: number;
}

export interface ConversionFunnel {
  registered: number;
  first_check_in: number;
  pro: number;
  conversion_rate: number;
}

export interface ThemeData {
  theme: string;
  count: number;
}

// --- System ---

export type ServiceStatus = "healthy" | "degraded" | "down";

export interface HealthStatus {
  api: ServiceStatus;
  database: ServiceStatus;
  elevenlabs: ServiceStatus;
  razorpay: ServiceStatus;
  uptime: number;
  timestamp: string;
}

export interface CostBreakdown {
  elevenlabs: { requests: number; cost: number };
  gemini: { requests: number; cost: number };
}

export interface ErrorLog {
  id: string;
  level: "error" | "warn" | "fatal";
  message: string;
  stack: string | null;
  endpoint: string;
  user_id: string | null;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  source: string;
  status: "success" | "failed" | "pending";
  payload: Record<string, unknown>;
  response_code: number | null;
  attempts: number;
  created_at: string;
}

// --- Query Params ---

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}
