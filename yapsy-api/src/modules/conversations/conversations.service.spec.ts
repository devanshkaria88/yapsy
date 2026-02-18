import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConversationsService } from './conversations.service';
import { Journal } from '../journals/entities/journal.entity';
import { User } from '../users/entities/user.entity';
import { SubscriptionStatus } from '../../common/enums';
import { ElevenlabsService } from './elevenlabs.service';
import { TasksService } from '../tasks/tasks.service';
import { LlmProcessorService } from '../journals/llm-processor.service';
import { SaveConversationDto } from './dto';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let journalsRepo: jest.Mocked<Repository<Journal>>;
  let usersRepo: jest.Mocked<Repository<User>>;
  let elevenlabsService: jest.Mocked<ElevenlabsService>;
  let tasksService: jest.Mocked<TasksService>;
  let llmProcessor: jest.Mocked<LlmProcessorService>;

  const mockUser: User = {
    id: 'user-1',
    name: 'Test User',
    subscription_status: SubscriptionStatus.FREE,
    weekly_check_in_count: 0,
    weekly_check_in_reset_date: null,
    timezone: 'UTC',
  } as User;

  const mockJournal: Journal = {
    id: 'journal-1',
    user_id: 'user-1',
    date: '2026-02-18',
    processing_status: 'processing',
  } as Journal;

  beforeEach(async () => {
    const mockJournalsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockUsersRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockElevenlabsService = {
      getSignedUrl: jest.fn(),
      buildSessionConfig: jest.fn(),
    };

    const mockTasksService = {
      findTodayTasksForContext: jest.fn(),
    };

    const mockLlmProcessor = {
      processTranscript: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Journal),
          useValue: mockJournalsRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepo,
        },
        {
          provide: ElevenlabsService,
          useValue: mockElevenlabsService,
        },
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: LlmProcessorService,
          useValue: mockLlmProcessor,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    journalsRepo = module.get(getRepositoryToken(Journal));
    usersRepo = module.get(getRepositoryToken(User));
    elevenlabsService = module.get(ElevenlabsService);
    tasksService = module.get(TasksService);
    llmProcessor = module.get(LlmProcessorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('prepareSession', () => {
    it('should find user and return signed URL and session config', async () => {
      const _today = new Date().toISOString().split('T')[0];
      const nextMonday = service['getNextMonday']();
      const userWithReset = {
        ...mockUser,
        weekly_check_in_count: 0,
        weekly_check_in_reset_date: null,
      };

      usersRepo.findOne.mockResolvedValue(userWithReset);
      usersRepo.update.mockResolvedValue({ affected: 1 } as any);
      elevenlabsService.getSignedUrl.mockResolvedValue({
        signed_url: 'https://signed-url.example.com',
      });
      tasksService.findTodayTasksForContext.mockResolvedValue([]);
      elevenlabsService.buildSessionConfig.mockReturnValue({
        agent_id: 'agent-123',
        system_prompt: 'Test prompt',
      });

      const result = await service.prepareSession('user-1');

      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(usersRepo.update).toHaveBeenCalledWith('user-1', {
        weekly_check_in_count: 0,
        weekly_check_in_reset_date: nextMonday,
      });
      expect(result).toEqual({
        signed_url: 'https://signed-url.example.com',
        session_config: {
          agent_id: 'agent-123',
          system_prompt: 'Test prompt',
        },
      });
    });

    it('should throw HttpException 402 when free user reaches weekly limit', async () => {
      const userAtLimit = {
        ...mockUser,
        subscription_status: SubscriptionStatus.FREE,
        weekly_check_in_count: 3,
        weekly_check_in_reset_date: '2026-02-25',
      };

      usersRepo.findOne.mockResolvedValue(userAtLimit);

      await expect(service.prepareSession('user-1')).rejects.toThrow(
        HttpException,
      );

      try {
        await service.prepareSession('user-1');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.PAYMENT_REQUIRED);
        expect(error.response.code).toBe('WEEKLY_LIMIT_REACHED');
      }
    });

    it('should increment weekly_check_in_count', async () => {
      const userWithCount = {
        ...mockUser,
        weekly_check_in_count: 1,
        weekly_check_in_reset_date: '2026-02-25',
      };

      usersRepo.findOne.mockResolvedValue(userWithCount);
      usersRepo.update.mockResolvedValue({ affected: 1 } as any);
      elevenlabsService.getSignedUrl.mockResolvedValue({
        signed_url: 'https://signed-url.example.com',
      });
      tasksService.findTodayTasksForContext.mockResolvedValue([]);
      elevenlabsService.buildSessionConfig.mockReturnValue({
        agent_id: 'agent-123',
        system_prompt: 'Test prompt',
      });

      await service.prepareSession('user-1');

      expect(usersRepo.update).toHaveBeenCalledWith('user-1', {
        weekly_check_in_count: 2,
      });
    });

    it('should reset weekly count when reset date is passed', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastResetDate = yesterday.toISOString().split('T')[0];

      const userWithPastReset = {
        ...mockUser,
        weekly_check_in_count: 2,
        weekly_check_in_reset_date: pastResetDate,
      };

      usersRepo.findOne.mockResolvedValue(userWithPastReset);
      usersRepo.update.mockResolvedValue({ affected: 1 } as any);
      elevenlabsService.getSignedUrl.mockResolvedValue({
        signed_url: 'https://signed-url.example.com',
      });
      tasksService.findTodayTasksForContext.mockResolvedValue([]);
      elevenlabsService.buildSessionConfig.mockReturnValue({
        agent_id: 'agent-123',
        system_prompt: 'Test prompt',
      });

      await service.prepareSession('user-1');

      const nextMonday = service['getNextMonday']();
      expect(usersRepo.update).toHaveBeenCalledWith('user-1', {
        weekly_check_in_count: 0,
        weekly_check_in_reset_date: nextMonday,
      });
    });
  });

  describe('saveConversation', () => {
    it('should create and save journal entry', async () => {
      const dto: SaveConversationDto = {
        conversation_id: 'conv-123',
        transcript: [{ role: 'user', text: 'Hello', timestamp: 0 }],
        duration_seconds: 120,
        date: '2026-02-18',
      };

      const createdJournal = {
        ...mockJournal,
        ...dto,
      };

      journalsRepo.create.mockReturnValue(createdJournal as Journal);
      journalsRepo.save.mockResolvedValue(createdJournal);
      llmProcessor.processTranscript.mockResolvedValue(undefined);

      const result = await service.saveConversation('user-1', dto);

      expect(journalsRepo.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        date: '2026-02-18',
        elevenlabs_conversation_id: 'conv-123',
        duration_seconds: 120,
        transcript: dto.transcript,
        processing_status: 'processing',
      });
      expect(journalsRepo.save).toHaveBeenCalledWith(createdJournal);
      expect(llmProcessor.processTranscript).toHaveBeenCalledWith(
        createdJournal.id,
        'user-1',
        dto.transcript,
      );
      expect(result).toEqual(createdJournal);
    });

    it('should use current date when date not provided', async () => {
      const dto: SaveConversationDto = {
        conversation_id: 'conv-123',
        transcript: [],
        duration_seconds: 120,
      };

      const today = new Date().toISOString().split('T')[0];
      const createdJournal = {
        ...mockJournal,
        date: today,
      };

      journalsRepo.create.mockReturnValue(createdJournal as Journal);
      journalsRepo.save.mockResolvedValue(createdJournal);
      llmProcessor.processTranscript.mockResolvedValue(undefined);

      await service.saveConversation('user-1', dto);

      expect(journalsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          date: today,
        }),
      );
    });
  });

  describe('getProcessingStatus', () => {
    it('should return processing status for valid UUID', async () => {
      const journal = {
        ...mockJournal,
        processing_status: 'completed',
      };

      journalsRepo.findOne.mockResolvedValue(journal);

      const result = await service.getProcessingStatus(
        'user-1',
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual({ processing_status: 'completed' });
      expect(journalsRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: 'user-1',
        },
      });
    });

    it('should throw HttpException 400 for invalid UUID format', async () => {
      await expect(
        service.getProcessingStatus('user-1', 'invalid-id'),
      ).rejects.toThrow(HttpException);

      try {
        await service.getProcessingStatus('user-1', 'invalid-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw HttpException 404 when journal not found', async () => {
      journalsRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getProcessingStatus(
          'user-1',
          '123e4567-e89b-12d3-a456-426614174000',
        ),
      ).rejects.toThrow(HttpException);

      try {
        await service.getProcessingStatus(
          'user-1',
          '123e4567-e89b-12d3-a456-426614174000',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
