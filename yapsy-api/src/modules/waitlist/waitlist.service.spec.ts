import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { WaitlistService } from './waitlist.service';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { CreateWaitlistEntryDto } from './dto';

describe('WaitlistService', () => {
  let service: WaitlistService;
  let waitlistRepo: jest.Mocked<Repository<WaitlistEntry>>;
  let _configService: jest.Mocked<ConfigService>;

  const mockEntry: WaitlistEntry = {
    id: 'entry-1',
    email: 'test@example.com',
    country: 'US',
    synced_to_resend: false,
    created_at: new Date(),
  } as WaitlistEntry;

  beforeEach(async () => {
    const mockWaitlistRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        {
          provide: getRepositoryToken(WaitlistEntry),
          useValue: mockWaitlistRepo,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WaitlistService>(WaitlistService);
    waitlistRepo = module.get(getRepositoryToken(WaitlistEntry));
    _configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create and save waitlist entry', async () => {
      const dto: CreateWaitlistEntryDto = {
        email: 'new@example.com',
        country: 'GB',
        utm_source: 'twitter',
      };

      waitlistRepo.findOne.mockResolvedValue(null);
      waitlistRepo.create.mockReturnValue(mockEntry);
      waitlistRepo.save.mockResolvedValue(mockEntry);

      const result = await service.signup(dto, '192.168.1.1');

      expect(waitlistRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'new@example.com' },
      });
      expect(waitlistRepo.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        country: 'GB',
        utm_source: 'twitter',
        utm_medium: undefined,
        utm_campaign: undefined,
        ip_address: '192.168.1.1',
      });
      expect(waitlistRepo.save).toHaveBeenCalledWith(mockEntry);
      expect(result).toEqual(mockEntry);
    });

    it('should use UNKNOWN as default country when not provided', async () => {
      const dto: CreateWaitlistEntryDto = {
        email: 'test@example.com',
      };

      waitlistRepo.findOne.mockResolvedValue(null);
      waitlistRepo.create.mockReturnValue(mockEntry);
      waitlistRepo.save.mockResolvedValue(mockEntry);

      await service.signup(dto);

      expect(waitlistRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          country: 'UNKNOWN',
        }),
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: CreateWaitlistEntryDto = {
        email: 'existing@example.com',
      };

      waitlistRepo.findOne.mockResolvedValue(mockEntry);

      await expect(service.signup(dto)).rejects.toThrow(ConflictException);

      try {
        await service.signup(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response.code).toBe('ALREADY_ON_WAITLIST');
      }
    });
  });

  describe('getCount', () => {
    it('should return count of waitlist entries', async () => {
      waitlistRepo.count.mockResolvedValue(42);

      const result = await service.getCount();

      expect(waitlistRepo.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });
});
