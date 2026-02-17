import '../storage/secure_storage_service.dart';

/// Manages access + refresh tokens for backend API authentication.
class TokenManager {
  final SecureStorageService _storage;

  static const _accessTokenKey = 'yapsy_access_token';
  static const _refreshTokenKey = 'yapsy_refresh_token';

  TokenManager({required SecureStorageService storage}) : _storage = storage;

  /// Store both tokens after successful login / refresh.
  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await Future.wait([
      _storage.write(key: _accessTokenKey, value: accessToken),
      _storage.write(key: _refreshTokenKey, value: refreshToken),
    ]);
  }

  /// Read stored access token.
  Future<String?> getAccessToken() =>
      _storage.read(key: _accessTokenKey);

  /// Read stored refresh token.
  Future<String?> getRefreshToken() =>
      _storage.read(key: _refreshTokenKey);

  /// Clear all tokens on logout.
  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: _accessTokenKey),
      _storage.delete(key: _refreshTokenKey),
    ]);
  }

  /// Check if tokens exist (auth guard).
  Future<bool> hasTokens() =>
      _storage.containsKey(key: _accessTokenKey);
}
