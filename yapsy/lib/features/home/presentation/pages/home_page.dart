import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../core/widgets/mood_badge.dart';
import '../../../../core/widgets/yapsy_card.dart';
import '../../../../core/widgets/yapsy_error_state.dart';
import '../../../../core/widgets/yapsy_skeleton.dart';
import '../bloc/home_cubit.dart';

/// Home / Dashboard page with greeting, task summary, mood, themes, streaks.
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    context.read<HomeCubit>().loadDashboard();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: BlocBuilder<HomeCubit, HomeState>(
          builder: (context, state) {
            if (state is HomeLoading) return _buildSkeleton();
            if (state is HomeError) {
              return YapsyErrorState(
                message: state.message,
                onRetry: () => context.read<HomeCubit>().loadDashboard(),
              );
            }
            if (state is HomeLoaded) return _buildDashboard(context, state.data);
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildSkeleton() {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: AppSpacing.md),
          const YapsySkeleton(width: 200, height: 28),
          const SizedBox(height: AppSpacing.sm),
          const YapsySkeleton(width: 120, height: 16),
          const SizedBox(height: AppSpacing.xl),
          const YapsySkeleton.card(),
          const SizedBox(height: AppSpacing.md),
          const YapsySkeleton.card(),
          const SizedBox(height: AppSpacing.md),
          const YapsySkeleton.card(),
        ],
      ),
    );
  }

  Widget _buildDashboard(BuildContext context, dynamic data) {
    return RefreshIndicator(
      onRefresh: () => context.read<HomeCubit>().refresh(),
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
        children: [
          const SizedBox(height: AppSpacing.lg),

          // Greeting
          Text('${AppDateUtils.greeting()} \u{1F44B}', style: AppTypography.display),
          const SizedBox(height: AppSpacing.xs),
          Text(AppDateUtils.dayMonthYear(DateTime.now()), style: AppTypography.bodySmall),

          const SizedBox(height: AppSpacing.xl),

          // Today's mood
          if (data.todayMoodScore != null)
            Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: YapsyCard(
                child: Row(
                  children: [
                    MoodBadge(score: data.todayMoodScore!, size: 40),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Today\'s Mood', style: AppTypography.bodyLarge),
                          Text('Score: ${data.todayMoodScore}/10', style: AppTypography.caption),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // Task summary
          YapsyCard(
            onTap: () => context.go(RoutePaths.tasks),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.primarySurface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.check_circle_outline, color: AppColors.primary, size: 20),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Today\'s Tasks', style: AppTypography.bodyLarge),
                          Text(
                            '${data.completedTaskCount}/${data.todayTasks.length} completed',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: AppColors.textTertiary),
                  ],
                ),
                if (data.overdueTasks.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.sm),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.danger.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${data.overdueTasks.length} overdue',
                      style: AppTypography.caption.copyWith(color: AppColors.danger),
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Streak card
          YapsyCard(
            child: Row(
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.secondary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(
                    child: Text('\u{1F525}', style: TextStyle(fontSize: 20)),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${data.currentStreak}-day streak', style: AppTypography.bodyLarge),
                      Text('Longest: ${data.longestStreak} days', style: AppTypography.caption),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Themes
          if (data.themes.isNotEmpty) ...[
            Text('Themes', style: AppTypography.h3),
            const SizedBox(height: AppSpacing.sm),
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: data.themes.take(6).map<Widget>((theme) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(theme, style: AppTypography.caption.copyWith(color: AppColors.primary)),
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.md),
          ],

          // Voice CTA
          GestureDetector(
            onTap: () => context.go(RoutePaths.voice),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.mic_rounded, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Start your check-in', style: AppTypography.bodyLarge.copyWith(color: Colors.white)),
                        Text(
                          'Yap about your day',
                          style: AppTypography.caption.copyWith(color: Colors.white.withValues(alpha: 0.8)),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward, color: Colors.white),
                ],
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }
}
