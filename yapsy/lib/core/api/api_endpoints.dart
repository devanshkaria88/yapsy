/// All mobile API endpoint paths.
///
/// Base URL prefix `/api/v1/mobile` is handled by [ApiClient].
class ApiEndpoints {
  ApiEndpoints._();

  // Auth
  static const String authFirebase = '/auth/firebase';
  static const String authRefresh = '/auth/refresh';
  static const String authLogout = '/auth/logout';

  // Users
  static const String usersMe = '/users/me';
  static const String usersFcmToken = '/users/me/fcm-token';

  // Tasks
  static const String tasks = '/tasks';
  static const String tasksToday = '/tasks/today';
  static const String tasksOverdue = '/tasks/overdue';
  static const String tasksUpcoming = '/tasks/upcoming';
  static String tasksCalendar(int year, int month) =>
      '/tasks/calendar/$year/$month';
  static String taskById(String id) => '/tasks/$id';
  static String taskComplete(String id) => '/tasks/$id/complete';
  static String taskRollover(String id) => '/tasks/$id/rollover';

  // Conversations (Voice)
  static const String conversationsPrepare = '/conversations/prepare';
  static const String conversations = '/conversations';
  static String conversationStatus(String id) => '/conversations/$id/status';

  // Journals
  static const String journals = '/journals';
  static const String journalsToday = '/journals/today';
  static String journalById(String id) => '/journals/$id';
  static const String journalsStats = '/journals/stats';
  static const String journalsSearch = '/journals/search';

  // Insights
  static const String insightsMood = '/insights/mood';
  static const String insightsThemes = '/insights/themes';
  static const String insightsStreaks = '/insights/streaks';
  static const String insightsWeekly = '/insights/weekly';
  static const String insightsProductivity = '/insights/productivity';

  // Subscriptions
  static const String subscriptionPlans = '/subscriptions/plans';
  static const String subscriptionStatus = '/subscriptions/status';
  static const String subscriptionCreate = '/subscriptions/create';
  static const String subscriptionVerify = '/subscriptions/verify';
  static const String subscriptionCancel = '/subscriptions/cancel';

  // Promo
  static String promoValidate(String code) => '/promo/validate/$code';
  static const String promoRedeem = '/promo/redeem';

  // Notes
  static const String notes = '/notes';
  static String noteById(String id) => '/notes/$id';
}
