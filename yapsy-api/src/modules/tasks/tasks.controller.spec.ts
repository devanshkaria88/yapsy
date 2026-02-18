import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  RolloverTaskDto,
} from './dto';
import { Task } from './entities/task.entity';
import { TaskPriority, TaskStatus } from '../../common/enums';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  const mockTask: Task = {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Test Task',
    scheduled_date: '2026-02-18',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
  } as Task;

  beforeEach(async () => {
    const mockTasksService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findToday: jest.fn(),
      findOverdue: jest.fn(),
      findUpcoming: jest.fn(),
      findCalendarMonth: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      complete: jest.fn(),
      rollover: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call tasksService.create', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        scheduled_date: '2026-02-19',
      };

      tasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create('user-1', dto);

      expect(tasksService.create).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should call tasksService.findAll', async () => {
      const query: TaskQueryDto = { page: 1, limit: 20 };
      const mockResult = { items: [mockTask], meta: {} } as any;

      tasksService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll('user-1', query);

      expect(tasksService.findAll).toHaveBeenCalledWith('user-1', query);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findToday', () => {
    it('should call tasksService.findToday', async () => {
      tasksService.findToday.mockResolvedValue([mockTask]);

      const result = await controller.findToday('user-1');

      expect(tasksService.findToday).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findOverdue', () => {
    it('should call tasksService.findOverdue', async () => {
      tasksService.findOverdue.mockResolvedValue([mockTask]);

      const result = await controller.findOverdue('user-1');

      expect(tasksService.findOverdue).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findUpcoming', () => {
    it('should call tasksService.findUpcoming', async () => {
      tasksService.findUpcoming.mockResolvedValue([mockTask]);

      const result = await controller.findUpcoming('user-1');

      expect(tasksService.findUpcoming).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findCalendarMonth', () => {
    it('should call tasksService.findCalendarMonth', async () => {
      tasksService.findCalendarMonth.mockResolvedValue([mockTask]);

      const result = await controller.findCalendarMonth('user-1', 2026, 2);

      expect(tasksService.findCalendarMonth).toHaveBeenCalledWith(
        'user-1',
        2026,
        2,
      );
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findOne', () => {
    it('should call tasksService.findOne', async () => {
      tasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('user-1', 'task-1');

      expect(tasksService.findOne).toHaveBeenCalledWith('user-1', 'task-1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should call tasksService.update', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, title: 'Updated Title' };

      tasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update('user-1', 'task-1', dto);

      expect(tasksService.update).toHaveBeenCalledWith('user-1', 'task-1', dto);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('complete', () => {
    it('should call tasksService.complete', async () => {
      const completedTask = {
        ...mockTask,
        status: TaskStatus.COMPLETED,
      };

      tasksService.complete.mockResolvedValue(completedTask);

      const result = await controller.complete('user-1', 'task-1');

      expect(tasksService.complete).toHaveBeenCalledWith('user-1', 'task-1');
      expect(result).toEqual(completedTask);
    });
  });

  describe('rollover', () => {
    it('should call tasksService.rollover', async () => {
      const dto: RolloverTaskDto = { new_date: '2026-02-20' };
      const rolledOverTask = { ...mockTask, scheduled_date: '2026-02-20' };

      tasksService.rollover.mockResolvedValue(rolledOverTask);

      const result = await controller.rollover('user-1', 'task-1', dto);

      expect(tasksService.rollover).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        dto,
      );
      expect(result).toEqual(rolledOverTask);
    });
  });

  describe('remove', () => {
    it('should call tasksService.remove and return message', async () => {
      tasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('user-1', 'task-1');

      expect(tasksService.remove).toHaveBeenCalledWith('user-1', 'task-1');
      expect(result).toEqual({ message: 'Task deleted' });
    });
  });
});
