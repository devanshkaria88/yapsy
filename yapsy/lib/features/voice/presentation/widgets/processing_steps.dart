import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

/// Step-by-step progress display during post-session processing.
class ProcessingSteps extends StatelessWidget {
  final int currentStep;

  const ProcessingSteps({super.key, this.currentStep = 0});

  static const _steps = [
    'Uploading conversation',
    'Analyzing your check-in',
    'Extracting tasks & mood',
    'Creating journal entry',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(_steps.length, (index) {
        final isComplete = index < currentStep;
        final isActive = index == currentStep;

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
          child: Row(
            children: [
              // Step indicator
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isComplete
                      ? AppColors.success
                      : isActive
                          ? AppColors.primary
                          : AppColors.border,
                ),
                child: isComplete
                    ? const Icon(Icons.check, size: 16, color: Colors.white)
                    : isActive
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: Padding(
                              padding: EdgeInsets.all(4),
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            ),
                          )
                        : Center(
                            child: Text(
                              '${index + 1}',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.textTertiary,
                              ),
                            ),
                          ),
              ),
              const SizedBox(width: AppSpacing.md),
              // Step label
              Text(
                _steps[index],
                style: AppTypography.bodySmall.copyWith(
                  color: isComplete || isActive
                      ? AppColors.textPrimary
                      : AppColors.textTertiary,
                  fontWeight: isActive ? FontWeight.w500 : FontWeight.w400,
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}
