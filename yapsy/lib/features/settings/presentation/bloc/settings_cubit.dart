import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../auth/domain/entities/auth_user.dart';
import '../../domain/repositories/settings_repository.dart';

abstract class SettingsState extends Equatable {
  const SettingsState();
  @override
  List<Object?> get props => [];
}

class SettingsInitial extends SettingsState { const SettingsInitial(); }
class SettingsLoading extends SettingsState { const SettingsLoading(); }
class SettingsLoaded extends SettingsState {
  final AuthUser profile;
  const SettingsLoaded(this.profile);
  @override
  List<Object?> get props => [profile];
}
class SettingsUpdating extends SettingsState { const SettingsUpdating(); }
class SettingsError extends SettingsState {
  final String message;
  const SettingsError(this.message);
  @override
  List<Object?> get props => [message];
}

class SettingsCubit extends Cubit<SettingsState> {
  final SettingsRepository _repository;

  SettingsCubit({required SettingsRepository repository})
      : _repository = repository,
        super(const SettingsInitial());

  Future<void> loadProfile() async {
    emit(const SettingsLoading());
    final result = await _repository.getProfile();
    result.fold(
      (f) => emit(SettingsError(f.message)),
      (user) => emit(SettingsLoaded(user)),
    );
  }

  Future<void> updateProfile({String? name, String? timezone}) async {
    emit(const SettingsUpdating());
    final result = await _repository.updateProfile(name: name, timezone: timezone);
    result.fold(
      (f) => emit(SettingsError(f.message)),
      (user) => emit(SettingsLoaded(user)),
    );
  }

  Future<void> deleteAccount() async {
    final result = await _repository.deleteAccount();
    result.fold(
      (f) => emit(SettingsError(f.message)),
      (_) => emit(const SettingsInitial()),
    );
  }
}
