import 'package:dartz/dartz.dart' hide Task;
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../repositories/task_repository.dart';

class DeleteTask extends UseCase<void, DeleteTaskParams> {
  final TaskRepository repository;
  DeleteTask(this.repository);

  @override
  Future<Either<Failure, void>> call(DeleteTaskParams params) =>
      repository.deleteTask(params.id);
}

class DeleteTaskParams extends Equatable {
  final String id;
  const DeleteTaskParams(this.id);

  @override
  List<Object?> get props => [id];
}
