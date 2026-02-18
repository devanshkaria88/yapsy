import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistEntryDto } from './dto';
import { WaitlistEntry } from './entities/waitlist-entry.entity';

describe('WaitlistController', () => {
  let controller: WaitlistController;
  let waitlistService: jest.Mocked<WaitlistService>;

  beforeEach(async () => {
    const mockWaitlistService = {
      signup: jest.fn(),
      getCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
      providers: [
        {
          provide: WaitlistService,
          useValue: mockWaitlistService,
        },
      ],
    }).compile();

    controller = module.get<WaitlistController>(WaitlistController);
    waitlistService = module.get(WaitlistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call waitlistService.signup and return success message', async () => {
      const dto: CreateWaitlistEntryDto = {
        email: 'test@example.com',
      };

      const mockEntry: WaitlistEntry = {
        id: 'entry-1',
        email: 'test@example.com',
      } as WaitlistEntry;

      waitlistService.signup.mockResolvedValue(mockEntry);

      const result = await controller.signup(dto, '192.168.1.1');

      expect(waitlistService.signup).toHaveBeenCalledWith(dto, '192.168.1.1');
      expect(result).toEqual({
        success: true,
        message: "You're on the list!",
      });
    });
  });

  describe('getCount', () => {
    it('should call waitlistService.getCount and return count', async () => {
      waitlistService.getCount.mockResolvedValue(100);

      const result = await controller.getCount();

      expect(waitlistService.getCount).toHaveBeenCalled();
      expect(result).toEqual({ count: 100 });
    });
  });
});
