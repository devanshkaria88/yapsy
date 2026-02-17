import 'package:get_it/get_it.dart';

import 'core/api/api_client.dart';
import 'generated/yapsy_api_client.dart';
import 'core/auth/firebase_auth_service.dart';
import 'core/auth/token_manager.dart';
import 'core/network/network_info.dart';
import 'core/notifications/local_notification_service.dart';
import 'core/notifications/push_notification_service.dart';
import 'core/storage/secure_storage_service.dart';

// Auth
import 'features/auth/data/datasources/auth_remote_datasource.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/domain/repositories/auth_repository.dart';
import 'features/auth/domain/usecases/get_current_user.dart';
import 'features/auth/domain/usecases/sign_in_with_apple.dart';
import 'features/auth/domain/usecases/sign_in_with_google.dart';
import 'features/auth/domain/usecases/sign_out.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';

// Tasks
import 'features/tasks/data/datasources/task_remote_datasource.dart';
import 'features/tasks/data/repositories/task_repository_impl.dart';
import 'features/tasks/domain/repositories/task_repository.dart';
import 'features/tasks/domain/usecases/complete_task.dart';
import 'features/tasks/domain/usecases/create_task.dart';
import 'features/tasks/domain/usecases/delete_task.dart';
import 'features/tasks/domain/usecases/get_overdue_tasks.dart';
import 'features/tasks/domain/usecases/get_today_tasks.dart';
import 'features/tasks/domain/usecases/get_upcoming_tasks.dart';
import 'features/tasks/domain/usecases/rollover_task.dart';
import 'features/tasks/domain/usecases/update_task.dart';
import 'features/tasks/presentation/bloc/tasks_bloc.dart';

// Home
import 'features/home/data/datasources/home_remote_datasource.dart';
import 'features/home/data/repositories/home_repository_impl.dart';
import 'features/home/domain/repositories/home_repository.dart';
import 'features/home/domain/usecases/get_dashboard_data.dart';
import 'features/home/presentation/bloc/home_cubit.dart';

// Notes
import 'features/notes/data/datasources/notes_remote_datasource.dart';
import 'features/notes/data/repositories/notes_repository_impl.dart';
import 'features/notes/domain/repositories/notes_repository.dart';
import 'features/notes/domain/usecases/create_note.dart';
import 'features/notes/domain/usecases/get_notes.dart';
import 'features/notes/domain/usecases/update_note.dart';

// Voice
import 'features/voice/data/datasources/voice_remote_datasource.dart';
import 'features/voice/data/repositories/voice_repository_impl.dart';
import 'features/voice/domain/repositories/voice_repository.dart';
import 'features/voice/domain/usecases/poll_processing_status.dart';
import 'features/voice/domain/usecases/prepare_session.dart';
import 'features/voice/domain/usecases/save_conversation.dart';
import 'features/voice/presentation/bloc/voice_session_bloc.dart';

// Journal
import 'features/journal/data/datasources/journal_remote_datasource.dart';
import 'features/journal/data/repositories/journal_repository_impl.dart';
import 'features/journal/domain/repositories/journal_repository.dart';
import 'features/journal/domain/usecases/get_journal_detail.dart';
import 'features/journal/domain/usecases/get_journals.dart';
import 'features/journal/domain/usecases/search_journals.dart';
import 'features/journal/presentation/bloc/journal_detail_cubit.dart';
import 'features/journal/presentation/bloc/journal_list_cubit.dart';

// Insights
import 'features/insights/data/datasources/insights_remote_datasource.dart';
import 'features/insights/data/repositories/insights_repository_impl.dart';
import 'features/insights/domain/repositories/insights_repository.dart';
import 'features/insights/presentation/bloc/insights_cubit.dart';

// Subscription
import 'features/subscription/data/datasources/subscription_remote_datasource.dart';
import 'features/subscription/data/repositories/subscription_repository_impl.dart';
import 'features/subscription/domain/repositories/subscription_repository.dart';
import 'features/subscription/presentation/bloc/subscription_cubit.dart';

// Settings
import 'features/settings/data/datasources/settings_remote_datasource.dart';
import 'features/settings/data/repositories/settings_repository_impl.dart';
import 'features/settings/domain/repositories/settings_repository.dart';
import 'features/settings/presentation/bloc/settings_cubit.dart';

/// Service locator instance.
final sl = GetIt.instance;

/// Initialise all dependencies.
Future<void> initDependencies() async {
  // ─── Core ─────────────────────────────────────────────
  sl.registerLazySingleton<SecureStorageService>(() => SecureStorageService());
  sl.registerLazySingleton<TokenManager>(() => TokenManager(storage: sl()));
  sl.registerLazySingleton<FirebaseAuthService>(() => FirebaseAuthService());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfo());
  sl.registerLazySingleton<PushNotificationService>(() => PushNotificationService());
  sl.registerLazySingleton<LocalNotificationService>(() => LocalNotificationService());

  sl.registerLazySingleton<ApiClient>(() => ApiClient(tokenManager: sl()));
  sl.registerLazySingleton<YapsyApiClient>(
    () => YapsyApiClient(sl<ApiClient>().dio),
  );

  // ─── Features ─────────────────────────────────────────
  _initAuth();
  _initTasks();
  _initHome();
  _initNotes();
  _initVoice();
  _initJournal();
  _initInsights();
  _initSubscription();
  _initSettings();
}

void _initAuth() {
  sl.registerLazySingleton<AuthRemoteDataSource>(() => AuthRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl(remoteDataSource: sl(), firebaseAuth: sl(), tokenManager: sl()));
  sl.registerLazySingleton(() => SignInWithGoogle(sl()));
  sl.registerLazySingleton(() => SignInWithApple(sl()));
  sl.registerLazySingleton(() => SignOut(sl()));
  sl.registerLazySingleton(() => GetCurrentUser(sl()));
  sl.registerFactory(() => AuthBloc(signInWithGoogle: sl(), signInWithApple: sl(), signOut: sl(), getCurrentUser: sl(), authRepository: sl()));
}

void _initTasks() {
  sl.registerLazySingleton<TaskRemoteDataSource>(() => TaskRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<TaskRepository>(() => TaskRepositoryImpl(remote: sl()));
  sl.registerLazySingleton(() => GetTodayTasks(sl()));
  sl.registerLazySingleton(() => GetUpcomingTasks(sl()));
  sl.registerLazySingleton(() => GetOverdueTasks(sl()));
  sl.registerLazySingleton(() => CreateTask(sl()));
  sl.registerLazySingleton(() => UpdateTask(sl()));
  sl.registerLazySingleton(() => CompleteTask(sl()));
  sl.registerLazySingleton(() => RolloverTask(sl()));
  sl.registerLazySingleton(() => DeleteTask(sl()));
  sl.registerFactory(() => TasksBloc(
    getTodayTasks: sl(), getUpcomingTasks: sl(), getOverdueTasks: sl(),
    createTask: sl(), updateTask: sl(), completeTask: sl(), rolloverTask: sl(), deleteTask: sl(),
  ));
}

void _initHome() {
  sl.registerLazySingleton<HomeRemoteDataSource>(() => HomeRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<HomeRepository>(() => HomeRepositoryImpl(remote: sl()));
  sl.registerLazySingleton(() => GetDashboardData(sl()));
  sl.registerFactory(() => HomeCubit(getDashboardData: sl()));
}

void _initNotes() {
  sl.registerLazySingleton<NotesRemoteDataSource>(() => NotesRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<NotesRepository>(() => NotesRepositoryImpl(remote: sl()));
  sl.registerLazySingleton(() => GetNotes(sl()));
  sl.registerLazySingleton(() => CreateNote(sl()));
  sl.registerLazySingleton(() => UpdateNote(sl()));
}

void _initVoice() {
  sl.registerLazySingleton<VoiceRemoteDataSource>(() => VoiceRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<VoiceRepository>(() => VoiceRepositoryImpl(remote: sl()));
  sl.registerLazySingleton(() => PrepareSession(sl()));
  sl.registerLazySingleton(() => SaveConversation(sl()));
  sl.registerLazySingleton(() => PollProcessingStatus(sl()));
  sl.registerFactory(() => VoiceSessionBloc(prepareSession: sl(), saveConversation: sl(), pollStatus: sl()));
}

void _initJournal() {
  sl.registerLazySingleton<JournalRemoteDataSource>(() => JournalRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<JournalRepository>(() => JournalRepositoryImpl(remote: sl()));
  sl.registerLazySingleton(() => GetJournals(sl()));
  sl.registerLazySingleton(() => GetJournalDetail(sl()));
  sl.registerLazySingleton(() => SearchJournals(sl()));
  sl.registerFactory(() => JournalListCubit(getJournals: sl(), searchJournals: sl()));
  sl.registerFactory(() => JournalDetailCubit(getJournalDetail: sl()));
}

void _initInsights() {
  sl.registerLazySingleton<InsightsRemoteDataSource>(() => InsightsRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<InsightsRepository>(() => InsightsRepositoryImpl(remote: sl()));
  sl.registerFactory(() => InsightsCubit(repository: sl()));
}

void _initSubscription() {
  sl.registerLazySingleton<SubscriptionRemoteDataSource>(() => SubscriptionRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<SubscriptionRepository>(() => SubscriptionRepositoryImpl(remote: sl()));
  sl.registerFactory(() => SubscriptionCubit(repository: sl()));
}

void _initSettings() {
  sl.registerLazySingleton<SettingsRemoteDataSource>(() => SettingsRemoteDataSource(dio: sl<ApiClient>().dio));
  sl.registerLazySingleton<SettingsRepository>(() => SettingsRepositoryImpl(remote: sl()));
  sl.registerFactory(() => SettingsCubit(repository: sl()));
}
