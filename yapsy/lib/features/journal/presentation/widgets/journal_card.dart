import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../core/widgets/mood_badge.dart';
import '../../domain/entities/journal_entry.dart';

class JournalCard extends StatelessWidget {
  final JournalEntry journal;
  final VoidCallback? onTap;

  const JournalCard({super.key, required this.journal, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                MoodBadge(score: journal.moodScore),
                const Spacer(),
                Text(AppDateUtils.relativeDay(journal.createdAt), style: AppTypography.caption),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(journal.summary, style: AppTypography.bodyLarge, maxLines: 2, overflow: TextOverflow.ellipsis),
            if (journal.themes.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.sm),
              Wrap(
                spacing: 6,
                children: journal.themes.take(3).map((t) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(t, style: AppTypography.caption.copyWith(color: AppColors.primary, fontSize: 11)),
                )).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
