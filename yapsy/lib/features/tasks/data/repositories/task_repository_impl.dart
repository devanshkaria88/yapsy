import 'package:dartz/dartz.dart' hide Task;
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../../../generated/models/create_task_dto.dart';
import '../../../../generated/models/create_task_dto_priority.dart';
import '../../../../generated/models/update_task_dto.dart';
import '../../../../generated/models/update_task_dto_priority.dart';
import '../../domain/entities/task.dart';
import '../../domain/repositories/task_repository.dart';
import '../datasources/task_remote_datasource.dart';
import '../models/task_model.dart';

class TaskRepositoryImpl implements TaskRepository {
  final TaskRemoteDataSource _remote;
  TaskRepositoryImpl({required TaskRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, List<Task>>> getTodayTasks() async {
    try {
      final data = await _remote.getTodayTasks();
      return Right(data.map((j) => TaskModel.fromJson(j).toEntity()).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, List<Task>>> getOverdueTasks() async {
    try {
      final data = await _remote.getOverdueTasks();
      return Right(data.map((j) => TaskModel.fromJson(j).toEntity()).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, List<Task>>> getUpcomingTasks() async {
    try {
      final data = await _remote.getUpcomingTasks();
      return Right(data.map((j) => TaskModel.fromJson(j).toEntity()).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> getCalendarData(int year, int month) async {
    try {
      final data = await _remote.getCalendarData(year, month);
      return Right(data);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Task>> getTaskById(String id) async {
    try {
      final data = await _remote.getTaskById(id);
      return Right(TaskModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Task>> createTask({
    required String title,
    String? description,
    DateTime? dueDate,
    TaskPriority? priority,
  }) async {
    try {
      final dto = CreateTaskDto(
        title: title,
        scheduledDate: (dueDate ?? DateTime.now()).toIso8601String().split('T').first,
        description: description,
        priority: priority != null ? CreateTaskDtoPriority.fromJson(priority.name) : null,
      );
      final data = await _remote.createTask(dto.toJson());
      return Right(TaskModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Task>> updateTask({
    required String id,
    String? title,
    String? description,
    DateTime? dueDate,
    TaskPriority? priority,
  }) async {
    try {
      final dto = UpdateTaskDto(
        title: title,
        description: description,
        scheduledDate: dueDate?.toIso8601String().split('T').first,
        priority: priority != null ? UpdateTaskDtoPriority.fromJson(priority.name) : null,
      );
      final data = await _remote.updateTask(id, dto.toJson());
      return Right(TaskModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Task>> completeTask(String id) async {
    try {
      final data = await _remote.completeTask(id);
      return Right(TaskModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Task>> rolloverTask(String id) async {
    try {
      final data = await _remote.rolloverTask(id);
      return Right(TaskModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, void>> deleteTask(String id) async {
    try {
      await _remote.deleteTask(id);
      return const Right(null);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
