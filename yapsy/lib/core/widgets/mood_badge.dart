import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Mood emoji + score badge with coloured background.
class MoodBadge extends StatelessWidget {
  final int score;
  final bool showScore;
  final double size;

  const MoodBadge({
    super.key,
    required this.score,
    this.showScore = true,
    this.size = 32,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppColors.moodColor(score);
    final emoji = AppColors.moodEmoji(score);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(emoji, style: TextStyle(fontSize: size * 0.6)),
          if (showScore) ...[
            const SizedBox(width: 4),
            Text(
              '$score/10',
              style: TextStyle(
                fontFamily: GoogleFonts.inter().fontFamily,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
