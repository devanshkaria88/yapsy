import 'package:flutter/material.dart';

/// Yapsy design token colours.
class AppColors {
  AppColors._();

  // Primary
  static const Color primary = Color(0xFF7C3AED);
  static const Color primaryLight = Color(0xFFA78BFA);
  static const Color primaryDark = Color(0xFF5B21B6);
  static const Color primarySurface = Color(0xFFF5F3FF);

  // Secondary (Accent)
  static const Color secondary = Color(0xFFF59E0B);
  static const Color secondaryLight = Color(0xFFFBBF24);
  static const Color secondaryDark = Color(0xFFD97706);

  // Semantic
  static const Color success = Color(0xFF14B8A6);
  static const Color danger = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF97316);

  // Neutrals
  static const Color background = Color(0xFFFAFAF9);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1C1917);
  static const Color textSecondary = Color(0xFF78716C);
  static const Color textTertiary = Color(0xFFA8A29E);
  static const Color border = Color(0xFFE7E5E4);
  static const Color divider = Color(0xFFF5F5F4);
  static const Color disabled = Color(0xFFD6D3D1);

  // Mood score → colour mapping
  static Color moodColor(int score) => switch (score) {
    <= 2 => const Color(0xFFEF4444), // Red
    <= 4 => const Color(0xFFF97316), // Orange
    <= 6 => const Color(0xFFF59E0B), // Amber
    <= 8 => const Color(0xFF22C55E), // Green
    _ => const Color(0xFF10B981), // Emerald
  };

  // Mood score → emoji
  static String moodEmoji(int score) => switch (score) {
    <= 2 => '\u{1F614}', // 😔
    <= 4 => '\u{1F615}', // 😕
    <= 6 => '\u{1F610}', // 😐
    <= 8 => '\u{1F60A}', // 😊
    _ => '\u{1F604}', // 😄
  };

  // Voice orb states
  static const Color orbListening = primary;
  static const Color orbSpeaking = secondary;
  static const Color orbConnecting = Color(0xFF9CA3AF);
  static const Color orbError = danger;
  static const Color orbIdle = primaryLight;
}
