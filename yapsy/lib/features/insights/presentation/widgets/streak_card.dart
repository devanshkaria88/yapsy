import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/yapsy_card.dart';

class StreakCard extends StatelessWidget {
  final int current;
  final int longest;
  const StreakCard({super.key, required this.current, required this.longest});

  @override
  Widget build(BuildContext context) {
    return YapsyCard(
      child: Row(
        children: [
          Expanded(child: _StreakStat(label: 'Current Streak', value: '$current days', emoji: '\u{1F525}')),
          Container(width: 1, height: 40, color: AppColors.divider),
          Expanded(child: _StreakStat(label: 'Longest', value: '$longest days', emoji: '\u{1F3C6}')),
        ],
      ),
    );
  }
}

class _StreakStat extends StatelessWidget {
  final String label;
  final String value;
  final String emoji;
  const _StreakStat({required this.label, required this.value, required this.emoji});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 24)),
        const SizedBox(height: AppSpacing.xs),
        Text(value, style: AppTypography.bodyLarge),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}
