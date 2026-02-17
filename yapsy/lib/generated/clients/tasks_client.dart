// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/create_task_dto.dart';
import '../models/get_api_v1_mobile_tasks_response.dart';
import '../models/message_response_dto.dart';
import '../models/priority.dart';
import '../models/rollover_task_dto.dart';
import '../models/status.dart';
import '../models/task_response_dto.dart';
import '../models/update_task_dto.dart';

part 'tasks_client.g.dart';

@RestApi()
abstract class TasksClient {
  factory TasksClient(Dio dio, {String? baseUrl}) = _TasksClient;

  /// Create a new task
  @POST('/api/v1/mobile/tasks')
  Future<TaskResponseDto> mobileTasksControllerCreate({
    @Body() required CreateTaskDto body,
  });

  /// Get all tasks with pagination and filters.
  ///
  /// [date] - Filter by specific date.
  ///
  /// [from] - Start date for range filter.
  ///
  /// [to] - End date for range filter.
  @GET('/api/v1/mobile/tasks')
  Future<GetApiV1MobileTasksResponse> mobileTasksControllerFindAll({
    @Query('date') String? date,
    @Query('status') Status? status,
    @Query('from') String? from,
    @Query('to') String? to,
    @Query('priority') Priority? priority,
    @Query('page') num? page = 1,
    @Query('limit') num? limit = 20,
  });

  /// Get tasks for today
  @GET('/api/v1/mobile/tasks/today')
  Future<List<TaskResponseDto>> mobileTasksControllerFindToday();

  /// Get overdue pending tasks
  @GET('/api/v1/mobile/tasks/overdue')
  Future<List<TaskResponseDto>> mobileTasksControllerFindOverdue();

  /// Get upcoming tasks (next 14 days)
  @GET('/api/v1/mobile/tasks/upcoming')
  Future<List<TaskResponseDto>> mobileTasksControllerFindUpcoming();

  /// Get tasks for a calendar month.
  ///
  /// [year] - Year (e.g. 2026).
  ///
  /// [month] - Month (1-12).
  @GET('/api/v1/mobile/tasks/calendar/{year}/{month}')
  Future<List<TaskResponseDto>> mobileTasksControllerFindCalendarMonth({
    @Path('year') required num year,
    @Path('month') required num month,
  });

  /// Get a task by ID.
  ///
  /// [id] - Task ID.
  @GET('/api/v1/mobile/tasks/{id}')
  Future<TaskResponseDto> mobileTasksControllerFindOne({
    @Path('id') required String id,
  });

  /// Update a task.
  ///
  /// [id] - Task ID.
  @PATCH('/api/v1/mobile/tasks/{id}')
  Future<TaskResponseDto> mobileTasksControllerUpdate({
    @Path('id') required String id,
    @Body() required UpdateTaskDto body,
  });

  /// Delete a task (soft delete).
  ///
  /// [id] - Task ID.
  @DELETE('/api/v1/mobile/tasks/{id}')
  Future<MessageResponseDto> mobileTasksControllerRemove({
    @Path('id') required String id,
  });

  /// Mark a task as completed.
  ///
  /// [id] - Task ID.
  @PATCH('/api/v1/mobile/tasks/{id}/complete')
  Future<TaskResponseDto> mobileTasksControllerComplete({
    @Path('id') required String id,
  });

  /// Roll over a task to a new date.
  ///
  /// [id] - Task ID.
  @POST('/api/v1/mobile/tasks/{id}/rollover')
  Future<TaskResponseDto> mobileTasksControllerRollover({
    @Path('id') required String id,
    @Body() required RolloverTaskDto body,
  });
}
