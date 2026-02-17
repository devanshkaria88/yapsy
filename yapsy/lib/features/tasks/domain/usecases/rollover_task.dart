import 'package:dartz/dartz.dart' hide Task;
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class RolloverTask extends UseCase<Task, RolloverTaskParams> {
  final TaskRepository repository;
  RolloverTask(this.repository);

  @override
  Future<Either<Failure, Task>> call(RolloverTaskParams params) =>
      repository.rolloverTask(params.id);
}

class RolloverTaskParams extends Equatable {
  final String id;
  const RolloverTaskParams(this.id);

  @override
  List<Object?> get props => [id];
}
