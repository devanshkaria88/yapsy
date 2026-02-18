import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsightsService } from './insights.service';
import { Journal } from '../journals/entities/journal.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { MoodInsight } from './entities/mood-insight.entity';
import { LlmProcessorService } from '../journals/llm-processor.service';
import { JournalsService } from '../journals/journals.service';

describe('InsightsService', () => {
  let service: InsightsService;
  let journalsRepo: jest.Mocked<Repository<Journal>>;
  let _tasksRepo: jest.Mocked<Repository<Task>>;
  let usersRepo: jest.Mocked<Repository<User>>;
  let _moodInsightRepo: jest.Mocked<Repository<MoodInsight>>;
  let _llmProcessorService: jest.Mocked<LlmProcessorService>;
  let _journalsService: jest.Mocked<JournalsService>;

  const mockJournal: Journal = {
    id: 'journal-1',
    user_id: 'user-1',
    date: '2026-02-18',
    mood_score: 7,
    mood_label: 'good',
    themes: ['work', 'family'],
  } as Journal;

  beforeEach(async () => {
    const mockJournalsRepo = {
      createQueryBuilder: jest.fn(),
    };

    const mockTasksRepo = {
      createQueryBuilder: jest.fn(),
    };

    const mockUsersRepo = {
      findOne: jest.fn(),
    };

    const mockMoodInsightRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockLlmProcessorService = {
      generateWeeklyInsight: jest.fn(),
    };

    const mockJournalsService = {
      findByDateRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        {
          provide: getRepositoryToken(Journal),
          useValue: mockJournalsRepo,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepo,
        },
        {
          provide: getRepositoryToken(MoodInsight),
          useValue: mockMoodInsightRepo,
        },
        {
          provide: LlmProcessorService,
          useValue: mockLlmProcessorService,
        },
        {
          provide: JournalsService,
          useValue: mockJournalsService,
        },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    journalsRepo = module.get(getRepositoryToken(Journal));
    _tasksRepo = module.get(getRepositoryToken(Task));
    usersRepo = module.get(getRepositoryToken(User));
    _moodInsightRepo = module.get(getRepositoryToken(MoodInsight));
    _llmProcessorService = module.get(LlmProcessorService);
    _journalsService = module.get(JournalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMoodData', () => {
    it('should return mood data points for specified days', async () => {
      const mockJournals = [
        { ...mockJournal, date: '2026-02-15', mood_score: 7 },
        { ...mockJournal, id: 'journal-2', date: '2026-02-16', mood_score: 8 },
        {
          ...mockJournal,
          id: 'journal-3',
          date: '2026-02-17',
          mood_score: null,
        },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getMoodData('user-1', 7);

      expect(result).toEqual([
        { date: '2026-02-15', mood_score: 7, mood_label: 'good' },
        { date: '2026-02-16', mood_score: 8, mood_label: 'good' },
        { date: '2026-02-17', mood_score: null, mood_label: 'good' },
      ]);
    });
  });

  describe('getThemes', () => {
    it('should return theme counts sorted by frequency', async () => {
      const mockJournals = [
        { ...mockJournal, themes: ['work', 'family'] },
        { ...mockJournal, id: 'journal-2', themes: ['work', 'health'] },
        { ...mockJournal, id: 'journal-3', themes: ['family'] },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getThemes('user-1');

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].theme).toBe('work');
      expect(result[0].count).toBe(2);
      expect(result.find((t) => t.theme === 'family')?.count).toBe(2);
    });

    it('should return top 10 themes', async () => {
      const mockJournals = Array.from({ length: 20 }, (_, i) => ({
        ...mockJournal,
        id: `journal-${i}`,
        themes: [`theme-${i}`],
      }));

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getThemes('user-1');

      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe('getStreaks', () => {
    it('should calculate longest streak from journal dates', async () => {
      const mockUser: User = {
        id: 'user-1',
        current_streak: 3,
        total_check_ins: 10,
      } as User;

      usersRepo.findOne.mockResolvedValue(mockUser);

      const mockJournals = [
        { ...mockJournal, date: '2026-02-15' },
        { ...mockJournal, id: 'journal-2', date: '2026-02-16' },
        { ...mockJournal, id: 'journal-3', date: '2026-02-17' },
        { ...mockJournal, id: 'journal-4', date: '2026-02-19' },
        { ...mockJournal, id: 'journal-5', date: '2026-02-20' },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getStreaks('user-1');

      expect(result.current_streak).toBe(3);
      expect(result.longest_streak).toBe(3);
      expect(result.total_check_ins).toBe(10);
    });

    it('should handle consecutive dates correctly', async () => {
      const mockUser: User = {
        id: 'user-1',
        current_streak: 0,
        total_check_ins: 0,
      } as User;

      usersRepo.findOne.mockResolvedValue(mockUser);

      const mockJournals = [
        { ...mockJournal, date: '2026-02-10' },
        { ...mockJournal, id: 'journal-2', date: '2026-02-11' },
        { ...mockJournal, id: 'journal-3', date: '2026-02-12' },
        { ...mockJournal, id: 'journal-4', date: '2026-02-13' },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getStreaks('user-1');

      expect(result.longest_streak).toBe(4);
    });

    it('should handle non-consecutive dates', async () => {
      const mockUser: User = {
        id: 'user-1',
        current_streak: 0,
        total_check_ins: 0,
      } as User;

      usersRepo.findOne.mockResolvedValue(mockUser);

      const mockJournals = [
        { ...mockJournal, date: '2026-02-10' },
        { ...mockJournal, id: 'journal-2', date: '2026-02-12' },
        { ...mockJournal, id: 'journal-3', date: '2026-02-13' },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getStreaks('user-1');

      expect(result.longest_streak).toBe(2);
    });
  });
});
