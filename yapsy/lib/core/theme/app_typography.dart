import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Yapsy typography — Plus Jakarta Sans for headings, Inter for body.
class AppTypography {
  AppTypography._();

  static String get _headingFamily => GoogleFonts.plusJakartaSans().fontFamily!;
  static String get _bodyFamily => GoogleFonts.inter().fontFamily!;

  // Display — Plus Jakarta Sans Bold 28
  static TextStyle get display => TextStyle(
    fontFamily: _headingFamily,
    fontSize: 28,
    fontWeight: FontWeight.w700,
    height: 1.3,
    color: AppColors.textPrimary,
  );

  // Heading 1 — Plus Jakarta Sans SemiBold 24
  static TextStyle get h1 => TextStyle(
    fontFamily: _headingFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.3,
    color: AppColors.textPrimary,
  );

  // Heading 2 — Plus Jakarta Sans SemiBold 20
  static TextStyle get h2 => TextStyle(
    fontFamily: _headingFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  // Heading 3 — Plus Jakarta Sans SemiBold 18
  static TextStyle get h3 => TextStyle(
    fontFamily: _headingFamily,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  // Body Large — Inter Medium 16
  static TextStyle get bodyLarge => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  // Body — Inter Regular 16
  static TextStyle get body => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  // Body Small — Inter Regular 14
  static TextStyle get bodySmall => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );

  // Caption — Inter Regular 13
  static TextStyle get caption => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 13,
    fontWeight: FontWeight.w400,
    height: 1.4,
    color: AppColors.textSecondary,
  );

  // Label — Inter Medium 14 (buttons, nav items)
  static TextStyle get label => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  // Overline — Inter SemiBold 12 (section labels)
  static TextStyle get overline => TextStyle(
    fontFamily: _bodyFamily,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 1.4,
    letterSpacing: 0.5,
    color: AppColors.textSecondary,
  );
}
