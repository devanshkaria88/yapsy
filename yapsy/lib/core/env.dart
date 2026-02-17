/// Compile-time environment configuration.
///
/// Pass values via `--dart-define`:
/// ```
/// flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
/// ```
class Env {
  Env._();

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://supercerebellar-nonmaritally-harris.ngrok-free.dev',
  );

  static const String apiPrefix = 'api/v1/mobile';

  static const String elevenlabsAgentId = String.fromEnvironment(
    'ELEVENLABS_AGENT_ID',
    defaultValue: 'agent_1001khhw79f4fp0aj6qfnze2rv5f',
  );

  static const String razorpayKeyId = String.fromEnvironment(
    'RAZORPAY_KEY_ID',
    defaultValue: 'rzp_test_xxx',
  );

  /// Full base URL with mobile API prefix.
  static String get apiUrl => '$apiBaseUrl/$apiPrefix';
}
