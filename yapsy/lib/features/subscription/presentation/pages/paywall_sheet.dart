import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

/// Paywall bottom sheet triggered when free tier limit is reached.
class PaywallSheet extends StatelessWidget {
  final String feature;
  final VoidCallback? onUpgrade;

  const PaywallSheet({super.key, required this.feature, this.onUpgrade});

  static Future<void> show(BuildContext context, {required String feature, VoidCallback? onUpgrade}) {
    return showModalBottomSheet<void>(
      context: context,
      builder: (_) => PaywallSheet(feature: feature, onUpgrade: onUpgrade),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2))),
          const SizedBox(height: AppSpacing.lg),
          const Icon(Icons.star_rounded, size: 48, color: AppColors.secondary),
          const SizedBox(height: AppSpacing.md),
          Text('Upgrade to Yapsy Pro', style: AppTypography.h2),
          const SizedBox(height: AppSpacing.sm),
          Text('Unlock $feature and much more with a Pro subscription.',
            style: AppTypography.bodySmall, textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.lg),
          // Feature list
          for (final f in ['Unlimited voice check-ins', 'Journal search', 'Weekly AI insights', 'Productivity analytics'])
            Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Row(children: [
                const Icon(Icons.check_circle, size: 18, color: AppColors.success),
                const SizedBox(width: AppSpacing.sm),
                Text(f, style: AppTypography.body),
              ]),
            ),
          const SizedBox(height: AppSpacing.lg),
          SizedBox(
            width: double.infinity, height: AppSpacing.buttonHeight,
            child: ElevatedButton(onPressed: onUpgrade, child: const Text('View Plans')),
          ),
          const SizedBox(height: AppSpacing.sm),
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Maybe later')),
        ],
      ),
    );
  }
}
