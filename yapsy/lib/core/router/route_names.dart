/// Named route constants for GoRouter navigation.
class RouteNames {
  RouteNames._();

  // Root
  static const String splash = 'splash';

  // Onboarding
  static const String onboarding = 'onboarding';

  // Auth
  static const String login = 'login';

  // Main shell tabs
  static const String home = 'home';
  static const String tasks = 'tasks';
  static const String voice = 'voice';
  static const String journal = 'journal';
  static const String settings = 'settings';

  // Sub-routes
  static const String journalDetail = 'journal-detail';
  static const String voiceSession = 'voice-session';
  static const String voiceProcessing = 'voice-processing';
  static const String subscription = 'subscription';
}

/// Route path constants.
class RoutePaths {
  RoutePaths._();

  static const String splash = '/splash';
  static const String onboarding = '/onboarding';
  static const String login = '/auth/login';
  static const String home = '/home';
  static const String tasks = '/tasks';
  static const String voice = '/voice';
  static const String journal = '/journal';
  static const String journalDetail = '/journal/:id';
  static const String settings = '/settings';
  static const String voiceSession = '/voice/session';
  static const String voiceProcessing = '/voice/processing';
  static const String subscription = '/subscription';
}
