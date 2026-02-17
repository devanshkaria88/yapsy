import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/mood_data.dart' as entities;

class ThemeChips extends StatelessWidget {
  final List<entities.ThemeData> themes;
  const ThemeChips({super.key, required this.themes});

  @override
  Widget build(BuildContext context) {
    if (themes.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Conversation Themes', style: AppTypography.h3),
        const SizedBox(height: AppSpacing.sm),
        SizedBox(
          height: 36,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: themes.length,
            separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
            itemBuilder: (_, i) {
              final t = themes[i];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${t.theme} (${t.count})',
                  style: AppTypography.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w500),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
