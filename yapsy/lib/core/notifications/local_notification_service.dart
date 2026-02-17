import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Local notification scheduling (check-in reminders, streak alerts).
class LocalNotificationService {
  final FlutterLocalNotificationsPlugin _plugin;

  LocalNotificationService({FlutterLocalNotificationsPlugin? plugin})
      : _plugin = plugin ?? FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    const settings = InitializationSettings(android: android, iOS: ios);
    await _plugin.initialize(settings, onDidReceiveNotificationResponse: _onTap);
  }

  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const details = NotificationDetails(
      android: AndroidNotificationDetails(
        'yapsy_general',
        'General',
        channelDescription: 'Yapsy notifications',
        importance: Importance.high,
        priority: Priority.high,
      ),
      iOS: DarwinNotificationDetails(),
    );
    await _plugin.show(0, title, body, details, payload: payload);
  }

  Future<void> scheduleCheckinReminder({required TimeOfDay time}) async {
    // Implementation for scheduled daily reminders
    // Uses timezone-aware scheduling
  }

  Future<void> cancelCheckinReminder() async {
    await _plugin.cancel(100);
  }

  void _onTap(NotificationResponse response) {
    // Navigate based on payload
  }
}
