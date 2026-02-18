import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskPriority, TaskStatus } from '../../common/enums';
import { CreateTaskDto, UpdateTaskDto, RolloverTaskDto } from './dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: jest.Mocked<Repository<Task>>;
  let dataSource: jest.Mocked<DataSource>;

  const mockTask: Task = {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Test Task',
    description: 'Test Description',
    scheduled_date: '2026-02-18',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    source: 'manual',
    completed_at: null,
    rolled_from_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as Task;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      getRepository: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softRemove: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
    dataSource = module.get(DataSource);

    dataSource.createQueryRunner.mockReturnValue(
      mockQueryRunner as unknown as QueryRunner,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save task', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        scheduled_date: '2026-02-19',
        priority: TaskPriority.HIGH,
      };

      const createdTask = { ...mockTask, ...dto };
      taskRepository.create.mockReturnValue(createdTask as Task);
      taskRepository.save.mockResolvedValue(createdTask);

      const result = await service.create('user-1', dto);

      expect(taskRepository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        title: dto.title,
        description: dto.description,
        scheduled_date: dto.scheduled_date,
        priority: dto.priority,
        source: 'manual',
      });
      expect(taskRepository.save).toHaveBeenCalledWith(createdTask);
      expect(result).toEqual(createdTask);
    });

    it('should use default priority MEDIUM when not provided', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        scheduled_date: '2026-02-19',
      };

      const createdTask = {
        ...mockTask,
        ...dto,
        priority: TaskPriority.MEDIUM,
      };
      taskRepository.create.mockReturnValue(createdTask as Task);
      taskRepository.save.mockResolvedValue(createdTask);

      await service.create('user-1', dto);

      expect(taskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: TaskPriority.MEDIUM,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return task when found', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('user-1', 'task-1');

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-1', user_id: 'user-1' },
      });
    });

    it('should throw NotFoundException when task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'task-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should find task, assign dto, and save', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, title: 'Updated Title' };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update('user-1', 'task-1', dto);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-1', user_id: 'user-1' },
      });
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Updated Title' }),
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('complete', () => {
    it('should set status to COMPLETED and completed_at', async () => {
      const completedTask = {
        ...mockTask,
        status: TaskStatus.COMPLETED,
        completed_at: new Date(),
      };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.save.mockResolvedValue(completedTask);

      const result = await service.complete('user-1', 'task-1');

      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TaskStatus.COMPLETED,
          completed_at: expect.any(Date),
        }),
      );
      expect(result.status).toBe(TaskStatus.COMPLETED);
      expect(result.completed_at).toBeInstanceOf(Date);
    });
  });

  describe('remove', () => {
    it('should find task and softRemove', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.softRemove.mockResolvedValue(mockTask);

      await service.remove('user-1', 'task-1');

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-1', user_id: 'user-1' },
      });
      expect(taskRepository.softRemove).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('rollover', () => {
    it('should rollover task to new date', async () => {
      const dto: RolloverTaskDto = { new_date: '2026-02-20' };
      const pendingTask = {
        ...mockTask,
        status: TaskStatus.PENDING,
      };
      const rolledOverTask = {
        ...pendingTask,
        status: TaskStatus.ROLLED_OVER,
      };
      const newTask = {
        ...mockTask,
        id: 'task-2',
        scheduled_date: '2026-02-20',
        status: TaskStatus.PENDING,
        rolled_from_id: 'task-1',
        source: 'rollover',
      };

      const mockTaskRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      };

      mockQueryRunner.manager.getRepository.mockReturnValue(
        mockTaskRepo as any,
      );
      mockTaskRepo.findOne.mockResolvedValue(pendingTask);
      mockTaskRepo.save
        .mockResolvedValueOnce(rolledOverTask)
        .mockResolvedValueOnce(newTask);
      mockTaskRepo.create.mockReturnValue(newTask);

      const result = await service.rollover('user-1', 'task-1', dto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockTaskRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'task-1', user_id: 'user-1' },
      });
      expect(mockTaskRepo.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(newTask);
    });

    it('should rollback transaction on error', async () => {
      const dto: RolloverTaskDto = { new_date: '2026-02-20' };
      const mockTaskRepo = {
        findOne: jest.fn(),
      };

      mockQueryRunner.manager.getRepository.mockReturnValue(
        mockTaskRepo as any,
      );
      mockTaskRepo.findOne.mockResolvedValue(null);

      await expect(service.rollover('user-1', 'task-1', dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
