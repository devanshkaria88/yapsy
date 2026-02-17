import 'package:firebase_messaging/firebase_messaging.dart';

/// FCM push notification setup and handling.
class PushNotificationService {
  final FirebaseMessaging _fcm;

  PushNotificationService({FirebaseMessaging? fcm})
      : _fcm = fcm ?? FirebaseMessaging.instance;

  Future<String?> init() async {
    // Request permission (iOS)
    await _fcm.requestPermission(alert: true, badge: true, sound: true);

    // Get FCM token
    final token = await _fcm.getToken();

    // Listen for token refresh
    _fcm.onTokenRefresh.listen(_onTokenRefresh);

    // Foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Background/terminated tap
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageTap);

    return token;
  }

  void _onTokenRefresh(String newToken) {
    // Will be wired to updateFcmToken use case
  }

  void _handleForegroundMessage(RemoteMessage message) {
    // Show local notification
  }

  void _handleMessageTap(RemoteMessage message) {
    // Navigate to relevant screen based on payload
  }
}
