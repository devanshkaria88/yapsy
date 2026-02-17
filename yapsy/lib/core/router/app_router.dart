import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/journal/presentation/pages/journal_detail_page.dart';
import '../../features/journal/presentation/pages/journal_list_page.dart';
import '../../features/onboarding/presentation/pages/onboarding_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../../features/subscription/presentation/pages/subscription_page.dart';
import '../../features/tasks/presentation/pages/tasks_page.dart';
import '../../features/voice/presentation/pages/pre_checkin_page.dart';
import '../../features/voice/presentation/pages/processing_page.dart';
import '../../features/voice/presentation/pages/voice_session_page.dart';
import '../widgets/main_shell.dart';
import 'route_names.dart';
import 'splash_page.dart';

/// App-level GoRouter configuration with auth-guarded routes.
class AppRouter {
  AppRouter._();

  static GoRouter router(AuthBloc authBloc) {
    return GoRouter(
      initialLocation: RoutePaths.splash,
      debugLogDiagnostics: true,
      refreshListenable: _GoRouterAuthRefresh(authBloc),
      redirect: (BuildContext context, GoRouterState state) {
        final authState = authBloc.state;
        final currentPath = state.matchedLocation;

        final isAuthRoute = currentPath.startsWith('/auth');
        final isOnboarding = currentPath.startsWith('/onboarding');
        final isSplash = currentPath == RoutePaths.splash;

        // Don't redirect if we're on splash — it handles its own routing
        if (isSplash) return null;

        // If unauthenticated and not on auth/onboarding, go to login
        if (authState is AuthUnauthenticated) {
          if (!isAuthRoute && !isOnboarding) {
            return RoutePaths.login;
          }
        }

        // If authenticated and on auth route, redirect to home
        if (authState is AuthAuthenticated && isAuthRoute) {
          return RoutePaths.home;
        }

        return null;
      },
      routes: [
        // Splash
        GoRoute(
          path: RoutePaths.splash,
          name: RouteNames.splash,
          builder: (_, __) => const SplashPage(),
        ),

        // Onboarding
        GoRoute(
          path: RoutePaths.onboarding,
          name: RouteNames.onboarding,
          builder: (_, __) => const OnboardingPage(),
        ),

        // Auth routes (no bottom nav)
        GoRoute(
          path: RoutePaths.login,
          name: RouteNames.login,
          builder: (_, __) => const LoginPage(),
        ),

        // Main shell with bottom navigation
        ShellRoute(
          builder: (_, __, child) => MainShell(child: child),
          routes: [
            GoRoute(
              path: RoutePaths.home,
              name: RouteNames.home,
              pageBuilder: (_, __) => const NoTransitionPage(
                child: HomePage(),
              ),
            ),
            GoRoute(
              path: RoutePaths.tasks,
              name: RouteNames.tasks,
              pageBuilder: (_, __) => const NoTransitionPage(
                child: TasksPage(),
              ),
            ),
            GoRoute(
              path: RoutePaths.voice,
              name: RouteNames.voice,
              pageBuilder: (_, __) => const NoTransitionPage(
                child: PreCheckinPage(),
              ),
            ),
            GoRoute(
              path: RoutePaths.journal,
              name: RouteNames.journal,
              pageBuilder: (_, __) => const NoTransitionPage(
                child: JournalListPage(),
              ),
            ),
            GoRoute(
              path: RoutePaths.journalDetail,
              name: RouteNames.journalDetail,
              builder: (_, state) => JournalDetailPage(
                id: state.pathParameters['id']!,
              ),
            ),
            GoRoute(
              path: RoutePaths.settings,
              name: RouteNames.settings,
              pageBuilder: (_, __) => const NoTransitionPage(
                child: SettingsPage(),
              ),
            ),
          ],
        ),

        // Full-screen routes (no bottom nav)
        GoRoute(
          path: RoutePaths.voiceSession,
          name: RouteNames.voiceSession,
          builder: (_, __) => const VoiceSessionPage(),
        ),
        GoRoute(
          path: RoutePaths.voiceProcessing,
          name: RouteNames.voiceProcessing,
          builder: (_, __) => const ProcessingPage(),
        ),
        GoRoute(
          path: RoutePaths.subscription,
          name: RouteNames.subscription,
          builder: (_, __) => const SubscriptionPage(),
        ),
      ],
    );
  }
}

/// Bridges [AuthBloc] stream to [GoRouter.refreshListenable].
class _GoRouterAuthRefresh extends ChangeNotifier {
  _GoRouterAuthRefresh(AuthBloc authBloc) {
    authBloc.stream.listen((_) => notifyListeners());
  }
}
