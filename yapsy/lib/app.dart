import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/home/presentation/bloc/home_cubit.dart';
import 'features/insights/presentation/bloc/insights_cubit.dart';
import 'features/journal/presentation/bloc/journal_detail_cubit.dart';
import 'features/journal/presentation/bloc/journal_list_cubit.dart';
import 'features/settings/presentation/bloc/settings_cubit.dart';
import 'features/subscription/presentation/bloc/subscription_cubit.dart';
import 'features/tasks/presentation/bloc/tasks_bloc.dart';
import 'features/voice/presentation/bloc/voice_session_bloc.dart';
import 'injection_container.dart';

/// Root app widget — sets up theme, router, and global BLoC providers.
class YapsyApp extends StatefulWidget {
  const YapsyApp({super.key});

  @override
  State<YapsyApp> createState() => _YapsyAppState();
}

class _YapsyAppState extends State<YapsyApp> {
  late final AuthBloc _authBloc;

  @override
  void initState() {
    super.initState();
    _authBloc = sl<AuthBloc>();
    _authBloc.add(const AuthCheckRequested());
  }

  @override
  void dispose() {
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>.value(value: _authBloc),
        BlocProvider<HomeCubit>(create: (_) => sl<HomeCubit>()),
        BlocProvider<TasksBloc>(create: (_) => sl<TasksBloc>()),
        BlocProvider<VoiceSessionBloc>(create: (_) => sl<VoiceSessionBloc>()),
        BlocProvider<JournalListCubit>(create: (_) => sl<JournalListCubit>()),
        BlocProvider<JournalDetailCubit>(create: (_) => sl<JournalDetailCubit>()),
        BlocProvider<InsightsCubit>(create: (_) => sl<InsightsCubit>()),
        BlocProvider<SubscriptionCubit>(create: (_) => sl<SubscriptionCubit>()),
        BlocProvider<SettingsCubit>(create: (_) => sl<SettingsCubit>()),
      ],
      child: MaterialApp.router(
        title: 'Yapsy',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        routerConfig: AppRouter.router(_authBloc),
      ),
    );
  }
}
