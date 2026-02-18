import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JournalsService } from './journals.service';
import { Journal } from './entities/journal.entity';

describe('JournalsService', () => {
  let service: JournalsService;
  let journalsRepo: jest.Mocked<Repository<Journal>>;

  const mockJournal: Journal = {
    id: 'journal-1',
    user_id: 'user-1',
    date: '2026-02-18',
    mood_score: 7,
    summary: 'Test summary',
  } as Journal;

  beforeEach(async () => {
    const mockJournalsRepo = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalsService,
        {
          provide: getRepositoryToken(Journal),
          useValue: mockJournalsRepo,
        },
      ],
    }).compile();

    service = module.get<JournalsService>(JournalsService);
    journalsRepo = module.get(getRepositoryToken(Journal));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findToday', () => {
    it('should return journal for today', async () => {
      const today = new Date().toISOString().split('T')[0];
      journalsRepo.findOne.mockResolvedValue(mockJournal);

      const result = await service.findToday('user-1');

      expect(journalsRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: 'user-1', date: today },
      });
      expect(result).toEqual(mockJournal);
    });

    it('should return null when no journal found for today', async () => {
      const _today = new Date().toISOString().split('T')[0];
      journalsRepo.findOne.mockResolvedValue(null);

      const result = await service.findToday('user-1');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return journal when found', async () => {
      journalsRepo.findOne.mockResolvedValue(mockJournal);

      const result = await service.findOne('user-1', 'journal-1');

      expect(journalsRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'journal-1', user_id: 'user-1' },
      });
      expect(result).toEqual(mockJournal);
    });

    it('should throw NotFoundException when journal not found', async () => {
      journalsRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'journal-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findStats', () => {
    it('should return stats with entries, avg_mood, and total_entries', async () => {
      const mockJournals = [
        { ...mockJournal, mood_score: 7 },
        { ...mockJournal, id: 'journal-2', mood_score: 8 },
        { ...mockJournal, id: 'journal-3', mood_score: null },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findStats('user-1', 30);

      expect(result.entries).toEqual(mockJournals);
      expect(result.avg_mood).toBe(7.5);
      expect(result.total_entries).toBe(3);
    });

    it('should return 0 avg_mood when no journals have mood_score', async () => {
      const mockJournals = [
        { ...mockJournal, mood_score: null },
        { ...mockJournal, id: 'journal-2', mood_score: null },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockJournals),
      };

      journalsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findStats('user-1', 30);

      expect(result.avg_mood).toBe(0);
    });
  });
});
