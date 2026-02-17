import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../bloc/voice_session_bloc.dart';

/// Live scrolling transcript panel during voice sessions.
class TranscriptPanel extends StatelessWidget {
  final List<TranscriptEntry> entries;

  const TranscriptPanel({super.key, required this.entries});

  @override
  Widget build(BuildContext context) {
    if (entries.isEmpty) {
      return Center(
        child: Text(
          'Start talking...',
          style: AppTypography.bodySmall.copyWith(color: Colors.white54),
        ),
      );
    }

    return ListView.builder(
      reverse: true,
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: entries.length,
      itemBuilder: (_, index) {
        final entry = entries[entries.length - 1 - index];
        final isUser = entry.role == 'user';

        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.sm),
          child: Align(
            alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.75,
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm,
              ),
              decoration: BoxDecoration(
                color: isUser
                    ? AppColors.primary.withValues(alpha: 0.3)
                    : Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isUser ? 'You' : 'Yapsy',
                    style: AppTypography.overline.copyWith(
                      color: isUser ? AppColors.primaryLight : AppColors.secondaryLight,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    entry.text,
                    style: AppTypography.bodySmall.copyWith(color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
