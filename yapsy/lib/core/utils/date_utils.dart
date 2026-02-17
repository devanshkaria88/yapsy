import 'package:intl/intl.dart';

/// Date formatting helpers used across the app.
class AppDateUtils {
  AppDateUtils._();

  static final DateFormat _dayMonth = DateFormat('d MMM');
  static final DateFormat _dayMonthYear = DateFormat('d MMM yyyy');
  static final DateFormat _time = DateFormat('h:mm a');
  static final DateFormat _weekday = DateFormat('EEEE');
  static final DateFormat _shortWeekday = DateFormat('EEE');
  static final DateFormat _monthYear = DateFormat('MMMM yyyy');

  /// "15 Feb"
  static String dayMonth(DateTime date) => _dayMonth.format(date);

  /// "15 Feb 2026"
  static String dayMonthYear(DateTime date) => _dayMonthYear.format(date);

  /// "9:30 PM"
  static String time(DateTime date) => _time.format(date);

  /// "Saturday"
  static String weekday(DateTime date) => _weekday.format(date);

  /// "Sat"
  static String shortWeekday(DateTime date) => _shortWeekday.format(date);

  /// "February 2026"
  static String monthYear(DateTime date) => _monthYear.format(date);

  /// "Today", "Yesterday", "Tomorrow", or "15 Feb"
  static String relativeDay(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(date.year, date.month, date.day);
    final diff = target.difference(today).inDays;

    if (diff == 0) return 'Today';
    if (diff == -1) return 'Yesterday';
    if (diff == 1) return 'Tomorrow';
    return dayMonth(date);
  }

  /// "Good morning", "Good afternoon", "Good evening"
  static String greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /// Check if a date is today.
  static bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  /// Check if a date is in the past (before today).
  static bool isPast(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return date.isBefore(today);
  }
}
