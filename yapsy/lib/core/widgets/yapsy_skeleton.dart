import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Shimmer loading skeleton placeholder.
class YapsySkeleton extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const YapsySkeleton({
    super.key,
    this.width = double.infinity,
    this.height = 16,
    this.borderRadius = 4,
  });

  /// Preset: card-sized skeleton.
  const YapsySkeleton.card({super.key})
      : width = double.infinity,
        height = 80,
        borderRadius = AppSpacing.cardRadius;

  /// Preset: text line skeleton.
  const YapsySkeleton.line({super.key, this.width = 200})
      : height = 14,
        borderRadius = 4;

  /// Preset: circle avatar skeleton.
  const YapsySkeleton.circle({super.key, double size = 40})
      : width = size,
        height = size,
        borderRadius = size / 2;

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.border,
      highlightColor: AppColors.divider,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.border,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}
