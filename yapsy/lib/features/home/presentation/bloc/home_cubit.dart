import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entities/dashboard_data.dart';
import '../../domain/usecases/get_dashboard_data.dart';

// ─── States ──────────────────────────────────────────────

abstract class HomeState extends Equatable {
  const HomeState();
  @override
  List<Object?> get props => [];
}

class HomeInitial extends HomeState {
  const HomeInitial();
}

class HomeLoading extends HomeState {
  const HomeLoading();
}

class HomeLoaded extends HomeState {
  final DashboardData data;
  const HomeLoaded(this.data);
  @override
  List<Object?> get props => [data];
}

class HomeError extends HomeState {
  final String message;
  const HomeError(this.message);
  @override
  List<Object?> get props => [message];
}

// ─── Cubit ───────────────────────────────────────────────

class HomeCubit extends Cubit<HomeState> {
  final GetDashboardData _getDashboardData;

  HomeCubit({required GetDashboardData getDashboardData})
      : _getDashboardData = getDashboardData,
        super(const HomeInitial());

  Future<void> loadDashboard() async {
    emit(const HomeLoading());
    final result = await _getDashboardData(const NoParams());
    result.fold(
      (f) => emit(HomeError(f.message)),
      (data) => emit(HomeLoaded(data)),
    );
  }

  Future<void> refresh() async {
    final result = await _getDashboardData(const NoParams());
    result.fold(
      (f) => emit(HomeError(f.message)),
      (data) => emit(HomeLoaded(data)),
    );
  }
}
