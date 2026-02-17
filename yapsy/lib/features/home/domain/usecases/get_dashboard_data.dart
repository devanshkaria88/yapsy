import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/dashboard_data.dart';
import '../repositories/home_repository.dart';

class GetDashboardData extends UseCase<DashboardData, NoParams> {
  final HomeRepository repository;
  GetDashboardData(this.repository);

  @override
  Future<Either<Failure, DashboardData>> call(NoParams params) =>
      repository.getDashboardData();
}
