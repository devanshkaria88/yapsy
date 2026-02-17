# Yapsy — Flutter App Product Requirements Document

> **"Yap about your day. Yapsy handles the rest."**

**Project**: Yapsy — Voice-First Daily Companion App (Mobile Client)  
**Stack**: Flutter 3.27+ · Dart 3.6+ · BLoC + Clean Architecture  
**Backend**: Yapsy NestJS API (`/api/v1/mobile/*`)  
**Auth**: Firebase Authentication (Google, Apple, Email/Password for admin-only)  
**OpenAPI**: Auto-generated types from `/docs/mobile-json`  
**Company**: Eightspheres Technologies (India)  
**Author**: Devansh  
**Date**: February 2026

---

## 1. Overview

The Yapsy Flutter app is the primary user-facing client. Users talk to an AI voice agent about their day, and the system tracks tasks, captures mood journals, and surfaces psychological insights. The app consumes the Mobile API group from the backend.

**Key Interactions:**
- Voice check-in via ElevenLabs Conversational AI (WebSocket)
- Task CRUD (manual + voice-created)
- Journal browsing with mood visualisation
- Subscription management via Razorpay Flutter SDK
- Push notifications for reminders and streaks

---

## 2. Architecture

### 2.1 Clean Architecture Layers

```
┌───────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                         │
│  Pages (Widgets) ←→ BLoC/Cubit (State Management)            │
│                                                                │
│  - Stateless/Stateful widgets for UI                          │
│  - BLoCs emit states, consume events                          │
│  - No business logic in widgets                               │
│  - No direct data source access                               │
└───────────────────────────┬───────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼───────────────────────────────────┐
│                       DOMAIN LAYER                             │
│  Entities · Use Cases · Repository Interfaces                  │
│                                                                │
│  - Pure Dart, no Flutter imports                              │
│  - Entities are domain models (not API DTOs)                  │
│  - Use cases = single business action                         │
│  - Repository interfaces (abstract classes)                   │
│  - No knowledge of API, DB, or any data source                │
└───────────────────────────┬───────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼───────────────────────────────────┐
│                        DATA LAYER                              │
│  Repository Impls · Data Sources · DTOs · Mappers              │
│                                                                │
│  - Implements domain repository interfaces                    │
│  - Remote data source: API client (OpenAPI-generated types)   │
│  - Local data source: flutter_secure_storage, shared_prefs    │
│  - DTOs map to/from domain entities                           │
│  - Error handling: API errors → domain Failures               │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Feature-Based Module Structure

```
lib/
├── main.dart                           # Entry point, Firebase init, BLoC providers
├── app.dart                            # MaterialApp.router setup
├── injection_container.dart            # get_it service locator setup
│
├── core/
│   ├── api/
│   │   ├── api_client.dart             # Dio instance + interceptors
│   │   ├── api_interceptor.dart        # Auth token injection, 401 refresh
│   │   ├── api_endpoints.dart          # Endpoint path constants
│   │   └── api_response.dart           # Generic envelope wrapper
│   ├── auth/
│   │   ├── firebase_auth_service.dart  # Firebase Auth wrapper
│   │   ├── auth_state_provider.dart    # Stream<AuthState> (signed in/out)
│   │   └── token_manager.dart          # Firebase ID token → backend session
│   ├── error/
│   │   ├── failures.dart               # Domain failure classes
│   │   ├── exceptions.dart             # Data layer exceptions
│   │   └── error_handler.dart          # Global error-to-failure mapping
│   ├── network/
│   │   ├── network_info.dart           # Connectivity check
│   │   └── network_cubit.dart          # Online/offline state
│   ├── notifications/
│   │   ├── push_notification_service.dart   # FCM setup + handlers
│   │   └── local_notification_service.dart  # flutter_local_notifications
│   ├── storage/
│   │   └── secure_storage_service.dart # flutter_secure_storage wrapper
│   ├── theme/
│   │   ├── app_theme.dart              # Light + dark ThemeData
│   │   ├── app_colors.dart             # Yapsy colour constants
│   │   ├── app_typography.dart         # Text styles
│   │   └── app_spacing.dart            # Spacing constants (8px grid)
│   ├── router/
│   │   ├── app_router.dart             # GoRouter configuration
│   │   ├── route_names.dart            # Named route constants
│   │   └── auth_guard.dart             # Redirect unauthenticated users
│   ├── utils/
│   │   ├── date_utils.dart             # Date formatting helpers
│   │   ├── mood_utils.dart             # Mood score → colour/emoji mapping
│   │   └── debouncer.dart              # Search debounce utility
│   └── widgets/
│       ├── yapsy_button.dart           # Primary/secondary/text buttons
│       ├── yapsy_input.dart            # Styled text input
│       ├── yapsy_card.dart             # Standard card wrapper
│       ├── yapsy_badge.dart            # Status/mood badge
│       ├── yapsy_skeleton.dart         # Shimmer loading skeleton
│       ├── yapsy_empty_state.dart      # Reusable empty state
│       ├── yapsy_error_state.dart      # Reusable error state
│       ├── yapsy_bottom_sheet.dart     # Standard bottom sheet
│       ├── mood_badge.dart             # Mood emoji + score + colour
│       └── voice_orb.dart             # Animated voice orb widget
│
├── features/
│   ├── onboarding/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   └── onboarding_cubit.dart
│   │   │   └── pages/
│   │   │       ├── welcome_page.dart
│   │   │       ├── value_prop_page.dart
│   │   │       └── permissions_page.dart
│   │   └── (no domain/data — pure UI flow)
│   │
│   ├── auth/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   ├── auth_bloc.dart      # Global auth state
│   │   │   │   ├── auth_event.dart
│   │   │   │   └── auth_state.dart
│   │   │   └── pages/
│   │   │       ├── login_page.dart
│   │   │       ├── register_page.dart
│   │   │       └── forgot_password_page.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── auth_user.dart      # Domain user (uid, email, name)
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart # Abstract
│   │   │   └── usecases/
│   │   │       ├── sign_in_with_google.dart
│   │   │       ├── sign_in_with_apple.dart
│   │   │       ├── sign_out.dart
│   │   │       └── get_current_user.dart
│   │   └── data/
│   │       ├── repositories/
│   │       │   └── auth_repository_impl.dart
│   │       └── datasources/
│   │           └── firebase_auth_datasource.dart
│   │
│   ├── home/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   └── home_cubit.dart     # Dashboard data aggregation
│   │   │   └── pages/
│   │   │       └── home_page.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── dashboard_data.dart
│   │   │   ├── repositories/
│   │   │   │   └── home_repository.dart
│   │   │   └── usecases/
│   │   │       └── get_dashboard_data.dart
│   │   └── data/
│   │       ├── repositories/
│   │       │   └── home_repository_impl.dart
│   │       └── datasources/
│   │           └── home_remote_datasource.dart
│   │
│   ├── tasks/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   ├── tasks_bloc.dart
│   │   │   │   ├── tasks_event.dart
│   │   │   │   └── tasks_state.dart
│   │   │   ├── pages/
│   │   │   │   ├── tasks_page.dart         # Tab container
│   │   │   │   ├── today_tasks_view.dart
│   │   │   │   ├── upcoming_tasks_view.dart
│   │   │   │   └── calendar_view.dart
│   │   │   └── widgets/
│   │   │       ├── task_card.dart
│   │   │       ├── task_form_sheet.dart
│   │   │       └── overdue_sheet.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── task.dart
│   │   │   ├── repositories/
│   │   │   │   └── task_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_today_tasks.dart
│   │   │       ├── get_upcoming_tasks.dart
│   │   │       ├── get_calendar_tasks.dart
│   │   │       ├── create_task.dart
│   │   │       ├── update_task.dart
│   │   │       ├── complete_task.dart
│   │   │       ├── rollover_task.dart
│   │   │       └── delete_task.dart
│   │   └── data/
│   │       ├── models/
│   │       │   └── task_model.dart         # OpenAPI DTO → domain mapper
│   │       ├── repositories/
│   │       │   └── task_repository_impl.dart
│   │       └── datasources/
│   │           └── task_remote_datasource.dart
│   │
│   ├── voice/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   ├── voice_session_bloc.dart
│   │   │   │   ├── voice_session_event.dart
│   │   │   │   └── voice_session_state.dart
│   │   │   ├── pages/
│   │   │   │   ├── pre_checkin_page.dart
│   │   │   │   ├── voice_session_page.dart     # Full-screen orb
│   │   │   │   ├── processing_page.dart
│   │   │   │   └── voice_error_page.dart
│   │   │   └── widgets/
│   │   │       ├── voice_orb_animated.dart     # Orb with state animations
│   │   │       ├── transcript_panel.dart       # Live scrolling transcript
│   │   │       └── processing_steps.dart       # Step-by-step progress
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── voice_session.dart
│   │   │   │   └── voice_session_config.dart
│   │   │   ├── repositories/
│   │   │   │   └── voice_repository.dart
│   │   │   └── usecases/
│   │   │       ├── prepare_session.dart
│   │   │       ├── save_conversation.dart
│   │   │       └── poll_processing_status.dart
│   │   └── data/
│   │       ├── models/
│   │       │   └── voice_session_model.dart
│   │       ├── repositories/
│   │       │   └── voice_repository_impl.dart
│   │       └── datasources/
│   │           ├── voice_remote_datasource.dart
│   │           └── elevenlabs_ws_datasource.dart  # WebSocket to ElevenLabs
│   │
│   ├── journal/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   ├── journal_list_cubit.dart
│   │   │   │   └── journal_detail_cubit.dart
│   │   │   ├── pages/
│   │   │   │   ├── journal_list_page.dart
│   │   │   │   ├── journal_detail_page.dart
│   │   │   │   └── journal_search_page.dart
│   │   │   └── widgets/
│   │   │       ├── journal_card.dart
│   │   │       ├── mood_section.dart
│   │   │       ├── wins_struggles_section.dart
│   │   │       ├── actions_taken_section.dart
│   │   │       └── transcript_expandable.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── journal_entry.dart
│   │   │   ├── repositories/
│   │   │   │   └── journal_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_journals.dart
│   │   │       ├── get_journal_detail.dart
│   │   │       └── search_journals.dart
│   │   └── data/
│   │       ├── models/
│   │       │   └── journal_model.dart
│   │       ├── repositories/
│   │       │   └── journal_repository_impl.dart
│   │       └── datasources/
│   │           └── journal_remote_datasource.dart
│   │
│   ├── insights/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   └── insights_cubit.dart
│   │   │   └── widgets/
│   │   │       ├── mood_chart.dart         # fl_chart line chart
│   │   │       ├── theme_chips.dart
│   │   │       ├── streak_card.dart
│   │   │       └── weekly_insight_card.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── mood_data.dart
│   │   │   │   └── weekly_insight.dart
│   │   │   ├── repositories/
│   │   │   │   └── insights_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_mood_data.dart
│   │   │       ├── get_themes.dart
│   │   │       ├── get_streaks.dart
│   │   │       └── get_weekly_insight.dart
│   │   └── data/
│   │       ├── models/
│   │       │   └── mood_data_model.dart
│   │       ├── repositories/
│   │       │   └── insights_repository_impl.dart
│   │       └── datasources/
│   │           └── insights_remote_datasource.dart
│   │
│   ├── subscription/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   └── subscription_cubit.dart
│   │   │   ├── pages/
│   │   │   │   ├── subscription_page.dart
│   │   │   │   └── paywall_sheet.dart
│   │   │   └── widgets/
│   │   │       ├── plan_comparison.dart
│   │   │       └── promo_input.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── subscription_plan.dart
│   │   │   │   └── subscription_status.dart
│   │   │   ├── repositories/
│   │   │   │   └── subscription_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_plans.dart
│   │   │       ├── get_subscription_status.dart
│   │   │       ├── create_subscription.dart
│   │   │       ├── verify_payment.dart
│   │   │       ├── cancel_subscription.dart
│   │   │       ├── validate_promo.dart
│   │   │       └── redeem_promo.dart
│   │   └── data/
│   │       ├── models/
│   │       │   └── subscription_model.dart
│   │       ├── repositories/
│   │       │   └── subscription_repository_impl.dart
│   │       └── datasources/
│   │           ├── subscription_remote_datasource.dart
│   │           └── razorpay_datasource.dart     # Razorpay Flutter SDK
│   │
│   ├── settings/
│   │   ├── presentation/
│   │   │   ├── bloc/
│   │   │   │   └── settings_cubit.dart
│   │   │   └── pages/
│   │   │       ├── settings_page.dart
│   │   │       ├── edit_profile_sheet.dart
│   │   │       └── notification_settings_page.dart
│   │   ├── domain/
│   │   │   ├── repositories/
│   │   │   │   └── settings_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_profile.dart
│   │   │       ├── update_profile.dart
│   │   │       ├── update_fcm_token.dart
│   │   │       └── delete_account.dart
│   │   └── data/
│   │       ├── repositories/
│   │       │   └── settings_repository_impl.dart
│   │       └── datasources/
│   │           └── settings_remote_datasource.dart
│   │
│   └── notes/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── note.dart
│       │   ├── repositories/
│       │   │   └── notes_repository.dart
│       │   └── usecases/
│       │       ├── get_notes.dart
│       │       ├── create_note.dart
│       │       └── update_note.dart
│       └── data/
│           ├── models/
│           │   └── note_model.dart
│           ├── repositories/
│           │   └── notes_repository_impl.dart
│           └── datasources/
│               └── notes_remote_datasource.dart
│
├── generated/                          # OpenAPI auto-generated code
│   ├── api/                            # API client classes
│   ├── models/                         # DTO classes from OpenAPI spec
│   └── openapi.json                    # Cached spec for regeneration
│
└── assets/
    ├── svg/
    │   ├── logo.svg
    │   ├── logo_wordmark.svg
    │   ├── onboarding_1.svg
    │   ├── onboarding_2.svg
    │   ├── mic_permission.svg
    │   ├── empty_tasks.svg
    │   ├── empty_journal.svg
    │   ├── empty_dashboard.svg
    │   ├── no_internet.svg
    │   ├── voice_error.svg
    │   └── celebration.svg
    ├── fonts/
    │   ├── PlusJakartaSans/
    │   └── Inter/
    └── lottie/                         # Optional: orb animations
        ├── orb_breathing.json
        ├── orb_listening.json
        ├── orb_speaking.json
        ├── orb_thinking.json
        └── confetti.json
```

---

## 3. Authentication Flow (Firebase Auth)

The app uses Firebase Authentication as the identity provider. The backend validates Firebase ID tokens instead of managing its own JWT sessions.

### 3.1 Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUTTER APP                               │
│                                                              │
│  1. User taps "Sign in with Google" / "Sign in with Apple"  │
│                         │                                    │
│                         ▼                                    │
│  2. Firebase Auth SDK handles OAuth flow                     │
│     → Returns FirebaseUser + ID token                        │
│                         │                                    │
│                         ▼                                    │
│  3. App sends POST /api/v1/mobile/auth/firebase              │
│     Body: { firebase_token: "<id_token>" }                   │
│                         │                                    │
│                         ▼                                    │
│  4. Backend verifies token with Firebase Admin SDK            │
│     → Creates/finds user in DB                               │
│     → Returns { access_token, refresh_token, user }          │
│                         │                                    │
│                         ▼                                    │
│  5. App stores tokens in flutter_secure_storage               │
│     → Sets Dio auth interceptor                              │
│     → Navigates to home                                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Token Management

```dart
// core/auth/token_manager.dart

class TokenManager {
  final FlutterSecureStorage _storage;
  
  // Keys
  static const _accessTokenKey = 'yapsy_access_token';
  static const _refreshTokenKey = 'yapsy_refresh_token';
  
  // Store tokens after login
  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  });
  
  // Read stored access token
  Future<String?> getAccessToken();
  
  // Read stored refresh token  
  Future<String?> getRefreshToken();
  
  // Clear all on logout
  Future<void> clearTokens();
  
  // Check if tokens exist (for auth guard)
  Future<bool> hasTokens();
}
```

### 3.3 Auth Interceptor (Dio)

```dart
// core/api/api_interceptor.dart

class AuthInterceptor extends Interceptor {
  final TokenManager _tokenManager;
  final Dio _dio; // Fresh Dio for refresh calls (avoids loop)

  @override
  void onRequest(options, handler) {
    // Inject Bearer token from secure storage
  }

  @override
  void onError(err, handler) {
    if (err.response?.statusCode == 401) {
      // 1. Try refresh: POST /auth/refresh { refresh_token }
      // 2. Success → save new tokens, retry original request
      // 3. Fail → sign out Firebase + clear storage + emit AuthLoggedOut
    }
  }
}
```

### 3.4 Firebase Auth Service

```dart
// core/auth/firebase_auth_service.dart

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Stream of auth state changes
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Google Sign-In
  Future<UserCredential> signInWithGoogle();
  
  // Apple Sign-In  
  Future<UserCredential> signInWithApple();
  
  // Get current Firebase ID token (for backend auth)
  Future<String?> getIdToken({bool forceRefresh = false});
  
  // Sign out
  Future<void> signOut();
}
```

### 3.5 Auth States (BLoC)

```dart
sealed class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthAuthenticated extends AuthState {
  final AuthUser user;
}
class AuthUnauthenticated extends AuthState {}
class AuthError extends AuthState {
  final String message;
}
```

**Important:** The auth screens for the mobile app only show Google + Apple sign-in buttons. No email/password form for mobile users. Email/password is reserved for admin portal only.

---

## 4. API Client & OpenAPI Integration

### 4.1 OpenAPI Code Generation

The app generates DTOs and API client from the backend's OpenAPI spec.

**Spec URL:** `${BACKEND_BASE_URL}/docs/mobile-json`

**Generator:** `openapi_generator` (Dart/Flutter) or `swagger_parser`

```yaml
# openapi_generator config (pubspec.yaml or separate config)
openapi_generator:
  input_spec:
    path: generated/openapi.json  # Downloaded from /docs/mobile-json
  generator_name: dio
  output_directory: lib/generated
  additional_properties:
    pubName: yapsy_api
    useEnumExtension: true
```

**Workflow:**
1. Download spec: `curl ${BASE_URL}/docs/mobile-json > lib/generated/openapi.json`
2. Run generator: `dart run openapi_generator generate`
3. Use generated models in data layer mappers
4. **NEVER** use generated models in domain/presentation layers — always map to domain entities

### 4.2 Dio Configuration

```dart
// core/api/api_client.dart

class ApiClient {
  late final Dio dio;
  
  ApiClient({
    required TokenManager tokenManager,
    required String baseUrl,
  }) {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));
    
    dio.interceptors.addAll([
      AuthInterceptor(tokenManager: tokenManager, refreshDio: Dio()),
      LogInterceptor(requestBody: true, responseBody: true),
      // Add retry interceptor for network failures
    ]);
  }
}
```

### 4.3 API Response Parsing

All backend responses follow the envelope:
```json
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 100, "hasMore": true } }
```

```dart
// core/api/api_response.dart

class ApiResponse<T> {
  final bool success;
  final T data;
  final PaginationMeta? meta;
  
  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  );
}

class PaginationMeta {
  final int page;
  final int limit;
  final int total;
  final bool hasMore;
}
```

---

## 5. Dependency Injection

Using `get_it` with `injectable` for code generation:

```dart
// injection_container.dart

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // Core
  sl.registerLazySingleton(() => FlutterSecureStorage());
  sl.registerLazySingleton(() => TokenManager(sl()));
  sl.registerLazySingleton(() => FirebaseAuthService());
  sl.registerLazySingleton(() => ApiClient(tokenManager: sl(), baseUrl: Env.apiBaseUrl));
  sl.registerLazySingleton(() => PushNotificationService());
  sl.registerLazySingleton(() => LocalNotificationService());
  sl.registerLazySingleton(() => NetworkInfo());
  
  // Features — register per feature:
  // Data sources → Repositories → Use cases → BLoCs
  _initAuth();
  _initTasks();
  _initVoice();
  _initJournal();
  _initInsights();
  _initSubscription();
  _initSettings();
  _initNotes();
}
```

---

## 6. Navigation (GoRouter)

```dart
// core/router/app_router.dart

final appRouter = GoRouter(
  initialLocation: '/splash',
  redirect: (context, state) {
    final authState = context.read<AuthBloc>().state;
    final isAuthRoute = state.matchedLocation.startsWith('/auth');
    final isOnboarding = state.matchedLocation.startsWith('/onboarding');
    final isSplash = state.matchedLocation == '/splash';
    
    if (authState is AuthUnauthenticated && !isAuthRoute && !isOnboarding && !isSplash) {
      return '/auth/login';
    }
    if (authState is AuthAuthenticated && isAuthRoute) {
      return '/home';
    }
    return null;
  },
  routes: [
    GoRoute(path: '/splash', builder: (_, __) => const SplashPage()),
    
    // Onboarding (shown once)
    GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingFlow()),
    
    // Auth routes (no bottom nav)
    GoRoute(path: '/auth/login', builder: (_, __) => const LoginPage()),
    GoRoute(path: '/auth/register', builder: (_, __) => const RegisterPage()),
    GoRoute(path: '/auth/forgot-password', builder: (_, __) => const ForgotPasswordPage()),
    
    // Main shell with bottom navigation
    ShellRoute(
      builder: (_, __, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomePage()),
        GoRoute(path: '/tasks', builder: (_, __) => const TasksPage()),
        GoRoute(path: '/voice', builder: (_, __) => const PreCheckinPage()),
        GoRoute(path: '/journal', builder: (_, __) => const JournalListPage()),
        GoRoute(path: '/journal/:id', builder: (_, state) => JournalDetailPage(
          id: state.pathParameters['id']!,
        )),
        GoRoute(path: '/settings', builder: (_, __) => const SettingsPage()),
      ],
    ),
    
    // Full-screen routes (no bottom nav)
    GoRoute(path: '/voice/session', builder: (_, __) => const VoiceSessionPage()),
    GoRoute(path: '/voice/processing', builder: (_, __) => const ProcessingPage()),
    GoRoute(path: '/subscription', builder: (_, __) => const SubscriptionPage()),
  ],
);
```

---

## 7. Screens → BLoC Mapping

| Screen | BLoC/Cubit | Key States |
|--------|-----------|------------|
| Splash | AuthBloc | Initial → Authenticated/Unauthenticated |
| Login/Register | AuthBloc | Loading, Error, Authenticated |
| Home Dashboard | HomeCubit | Loading, Loaded(dashboard), Error |
| Tasks (Today/Upcoming/Calendar) | TasksBloc | Loading, Loaded(tasks), Creating, Error |
| Pre Check-in | VoiceSessionBloc | Idle, CheckingLimit, LimitReached, Ready |
| Voice Session | VoiceSessionBloc | Connecting, Listening, AgentSpeaking, Processing, Error |
| Processing | VoiceSessionBloc | Processing(steps), Completed(journalId), Error |
| Journal List | JournalListCubit | Loading, Loaded(journals, hasMore), Error |
| Journal Detail | JournalDetailCubit | Loading, Loaded(journal), Error |
| Insights | InsightsCubit | Loading, Loaded(mood, themes, streak), Error |
| Subscription | SubscriptionCubit | Loading, Loaded(plans, status), Purchasing, Error |
| Settings | SettingsCubit | Loaded(profile), Updating, Error |

---

## 8. Push Notifications

### 8.1 Firebase Cloud Messaging (FCM)

```dart
// core/notifications/push_notification_service.dart

class PushNotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> init() async {
    // 1. Request permission (iOS)
    await _fcm.requestPermission(alert: true, badge: true, sound: true);
    
    // 2. Get FCM token
    final token = await _fcm.getToken();
    // Send to backend: PATCH /users/me/fcm-token
    
    // 3. Listen for token refresh
    _fcm.onTokenRefresh.listen((newToken) {
      // Update backend
    });
    
    // 4. Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    
    // 5. Handle background/terminated tap
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageTap);
  }
}
```

### 8.2 Local Notifications (flutter_local_notifications)

Used for scheduled reminders:
- Daily check-in reminder (user-configured time, default 9 PM)
- Streak at-risk reminder ("Don't lose your 🔥 12-day streak!")
- Weekly insight ready

```dart
// core/notifications/local_notification_service.dart

class LocalNotificationService {
  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();

  Future<void> init();
  
  // Schedule daily check-in reminder
  Future<void> scheduleCheckinReminder({required TimeOfDay time});
  
  // Cancel scheduled reminder
  Future<void> cancelCheckinReminder();
  
  // Show instant notification (from FCM foreground handler)
  Future<void> showNotification({
    required String title,
    required String body,
    String? payload, // route to navigate on tap
  });
}
```

---

## 9. Voice Session (ElevenLabs Integration)

### 9.1 Session Lifecycle

```
1. User taps "Start Yapsy"
2. BLoC calls: GET /conversations/prepare → { signed_url, session_config }
3. Establish WebSocket to ElevenLabs signed URL
4. Audio stream: mic → ElevenLabs (user speech)
5. Audio stream: ElevenLabs → speaker (agent response)
6. Live transcript updates via WS events
7. User ends session or agent signals completion
8. App calls: POST /conversations { conversation_id, duration }
9. Backend processes transcript → journal entry
10. App polls: GET /conversations/:id/status until complete
11. Navigate to journal detail
```

### 9.2 Voice Orb States

```dart
enum OrbState {
  idle,        // Gentle breathing, purple
  connecting,  // Small pulsing, grey
  listening,   // Expanding purple pulses
  processing,  // Rotating/thinking
  speaking,    // Amber waves
  error,       // Red, static
  celebration, // Confetti burst
}
```

The orb should be implemented as a CustomPainter or Lottie animation set, controlled by the VoiceSessionBloc state.

---

## 10. Offline Behaviour

| Feature | Offline Capability |
|---------|-------------------|
| View cached tasks | ✅ Local cache via secure storage |
| Create/edit tasks | ❌ Requires API (queue for sync later — v2) |
| Voice check-in | ❌ Requires internet |
| View cached journals | ✅ Last viewed journal cached |
| Mood chart | ❌ Requires API |
| Settings | ✅ Cached profile |

Network state managed by `NetworkCubit` → shows `NoInternetPage` overlay when offline for features that require connectivity.

---

## 11. Environment Configuration

```dart
// Use flutter_dotenv or envied for compile-time env

class Env {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );
  
  static const elevenlabsAgentId = String.fromEnvironment('ELEVENLABS_AGENT_ID');
  
  static const razorpayKeyId = String.fromEnvironment(
    'RAZORPAY_KEY_ID',
    defaultValue: 'rzp_test_xxx',
  );
}
```

Build flavors:
```bash
# Development
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000

# Staging
flutter run --dart-define=API_BASE_URL=https://api-staging.yapsy.app

# Production
flutter run --release --dart-define=API_BASE_URL=https://api.yapsy.app
```

---

## 12. Key Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
    
  # State Management
  flutter_bloc: ^9.0.0
  equatable: ^2.0.0
  
  # Dependency Injection
  get_it: ^8.0.0
  injectable: ^2.5.0
  
  # Networking
  dio: ^5.7.0
  
  # Routing
  go_router: ^14.0.0
  
  # Firebase
  firebase_core: ^3.8.0
  firebase_auth: ^5.3.0
  firebase_messaging: ^15.1.0
  google_sign_in: ^6.2.0
  sign_in_with_apple: ^6.1.0
  
  # Storage
  flutter_secure_storage: ^9.2.0
  shared_preferences: ^2.3.0
  
  # UI
  flutter_svg: ^2.0.0
  lottie: ^3.1.0
  fl_chart: ^0.69.0          # Mood charts
  shimmer: ^3.0.0             # Skeleton loading
  cached_network_image: ^3.4.0
  
  # Notifications
  flutter_local_notifications: ^18.0.0
  
  # Payments
  razorpay_flutter: ^1.3.0
  
  # Audio (for ElevenLabs voice session)
  permission_handler: ^11.3.0
  
  # Utilities
  intl: ^0.19.0               # Date formatting
  dartz: ^0.10.1              # Either<Failure, Success> pattern
  freezed_annotation: ^2.4.0  # Immutable state classes
  json_annotation: ^4.9.0
  url_launcher: ^6.3.0
  connectivity_plus: ^6.1.0
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  bloc_test: ^9.1.0
  mockito: ^5.4.0
  build_runner: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0
  injectable_generator: ^2.6.0
  openapi_generator: ^5.0.0   # OpenAPI code gen
```

---

## 13. Design Tokens (Flutter)

```dart
// core/theme/app_colors.dart

class AppColors {
  // Primary
  static const primary = Color(0xFF7C3AED);       // Purple-600
  static const primaryLight = Color(0xFFA78BFA);   // Purple-400
  static const primaryDark = Color(0xFF5B21B6);    // Purple-800
  
  // Secondary (Accent)
  static const secondary = Color(0xFFF59E0B);      // Amber-500
  static const secondaryLight = Color(0xFFFBBF24);  // Amber-400
  
  // Semantic
  static const success = Color(0xFF14B8A6);         // Teal-500
  static const danger = Color(0xFFEF4444);          // Red-500
  static const warning = Color(0xFFF97316);         // Orange-500
  
  // Neutrals
  static const background = Color(0xFFFAFAF9);     // Stone-50
  static const surface = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF1C1917);     // Stone-900
  static const textSecondary = Color(0xFF78716C);   // Stone-500
  static const border = Color(0xFFE7E5E4);          // Stone-200
  
  // Mood scale
  static Color moodColor(int score) => switch (score) {
    <= 2 => const Color(0xFFEF4444),  // Red
    <= 4 => const Color(0xFFF97316),  // Orange
    <= 6 => const Color(0xFFF59E0B),  // Amber
    <= 8 => const Color(0xFF22C55E),  // Green
    _    => const Color(0xFF10B981),  // Emerald
  };
  
  // Orb states
  static const orbListening = primary;
  static const orbSpeaking = secondary;
  static const orbConnecting = Color(0xFF9CA3AF);   // Grey
  static const orbError = danger;
}

// core/theme/app_spacing.dart

class AppSpacing {
  static const double grid = 8.0;
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
  
  static const double cardRadius = 12.0;
  static const double inputRadius = 8.0;
  static const double buttonRadius = 12.0;
  static const double bottomNavHeight = 64.0;
}
```

---

## 14. Screen Count

| Category | Screens | Count |
|----------|---------|-------|
| Onboarding | Welcome, Value Prop, Permissions | 3 |
| Auth | Login, Register, Forgot Password | 3 |
| Home | Dashboard, Empty State | 2 |
| Tasks | Today, Upcoming, Calendar, Add/Edit Sheet, Overdue Sheet | 5 |
| Voice | Pre Check-in, Active Session, Processing, Error | 4 |
| Journal | List, Detail, Search | 3 |
| Settings | Main, Edit Profile, Notifications | 3 |
| Subscription | Management, Paywall, Confirmation | 3 |
| Utility | Splash, Loading, No Internet, Force Update, Delete Confirm | 5 |
| **Total** | | **31 screens** |

---

## 15. Non-Functional Requirements

### Performance
- App cold start < 3 seconds
- Screen transitions < 300ms
- Task CRUD < 500ms perceived latency
- Voice session connection < 2 seconds
- Image/avatar loading with placeholder + cache

### Security
- All tokens in flutter_secure_storage (encrypted keychain/keystore)
- No sensitive data in shared_preferences
- Certificate pinning for API calls (production)
- Firebase App Check enabled
- No logging of tokens or sensitive data in release mode

### Testing
- Unit tests for all use cases
- BLoC tests for all state management
- Widget tests for critical flows (auth, voice session)
- Integration tests for happy paths
- Minimum 70% code coverage on domain + data layers

### Accessibility
- Semantic labels on all tappable elements
- Minimum 44x44 touch targets
- Screen reader support for voice orb states
- High contrast mode support