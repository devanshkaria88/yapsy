import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/yapsy_card.dart';
import '../../domain/entities/mood_data.dart';

class WeeklyInsightCard extends StatelessWidget {
  final WeeklyInsight insight;
  const WeeklyInsightCard({super.key, required this.insight});

  @override
  Widget build(BuildContext context) {
    return YapsyCard(
      backgroundColor: AppColors.primarySurface,
      hasBorder: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: AppColors.primary, size: 20),
              const SizedBox(width: AppSpacing.sm),
              Text('Weekly Insight', style: AppTypography.h3.copyWith(color: AppColors.primary)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text('PRO', style: AppTypography.overline.copyWith(color: Colors.white, fontSize: 10)),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(insight.summary, style: AppTypography.body),
          if (insight.suggestion != null) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(
              '\u{1F4A1} ${insight.suggestion}',
              style: AppTypography.bodySmall.copyWith(fontStyle: FontStyle.italic),
            ),
          ],
        ],
      ),
    );
  }
}
