import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

enum YapsyButtonVariant { primary, secondary, text, danger }

/// Yapsy branded button — supports primary, secondary, text, and danger variants.
class YapsyButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final YapsyButtonVariant variant;
  final bool isLoading;
  final bool isExpanded;
  final IconData? icon;

  const YapsyButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = YapsyButtonVariant.primary,
    this.isLoading = false,
    this.isExpanded = true,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveOnPressed = isLoading ? null : onPressed;

    final Widget child = Row(
      mainAxisSize: isExpanded ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading)
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: _foregroundColor,
            ),
          )
        else ...[
          if (icon != null) ...[
            Icon(icon, size: 20),
            const SizedBox(width: AppSpacing.sm),
          ],
          Text(label),
        ],
      ],
    );

    final buttonStyle = _buttonStyle;

    return SizedBox(
      width: isExpanded ? double.infinity : null,
      height: AppSpacing.buttonHeight,
      child: switch (variant) {
        YapsyButtonVariant.primary =>
          ElevatedButton(onPressed: effectiveOnPressed, style: buttonStyle, child: child),
        YapsyButtonVariant.secondary =>
          OutlinedButton(onPressed: effectiveOnPressed, style: buttonStyle, child: child),
        YapsyButtonVariant.text =>
          TextButton(onPressed: effectiveOnPressed, style: buttonStyle, child: child),
        YapsyButtonVariant.danger =>
          ElevatedButton(onPressed: effectiveOnPressed, style: buttonStyle, child: child),
      },
    );
  }

  Color get _foregroundColor => switch (variant) {
    YapsyButtonVariant.primary => Colors.white,
    YapsyButtonVariant.secondary => AppColors.primary,
    YapsyButtonVariant.text => AppColors.primary,
    YapsyButtonVariant.danger => Colors.white,
  };

  ButtonStyle get _buttonStyle => switch (variant) {
    YapsyButtonVariant.primary => ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      textStyle: AppTypography.label.copyWith(color: Colors.white),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
      ),
    ),
    YapsyButtonVariant.secondary => OutlinedButton.styleFrom(
      foregroundColor: AppColors.primary,
      side: const BorderSide(color: AppColors.primary),
      textStyle: AppTypography.label,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
      ),
    ),
    YapsyButtonVariant.text => TextButton.styleFrom(
      foregroundColor: AppColors.primary,
      textStyle: AppTypography.label,
    ),
    YapsyButtonVariant.danger => ElevatedButton.styleFrom(
      backgroundColor: AppColors.danger,
      foregroundColor: Colors.white,
      textStyle: AppTypography.label.copyWith(color: Colors.white),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
      ),
    ),
  };
}
