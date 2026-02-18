import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemService } from './system.service';
import { WebhookEvent } from '../subscriptions/entities/webhook-event.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

describe('SystemService', () => {
  let service: SystemService;
  let webhookRepo: jest.Mocked<Repository<WebhookEvent>>;
  let subscriptionsService: jest.Mocked<SubscriptionsService>;

  const mockWebhookEvent: WebhookEvent = {
    id: 'webhook-1',
    source: 'razorpay',
    event_type: 'subscription.created',
    payload: {},
    processed: false,
  } as WebhookEvent;

  beforeEach(async () => {
    const mockWebhookRepo = {
      manager: {
        query: jest.fn(),
      },
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };

    const mockSubscriptionsService = {
      retryWebhook: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemService,
        {
          provide: getRepositoryToken(WebhookEvent),
          useValue: mockWebhookRepo,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<SystemService>(SystemService);
    webhookRepo = module.get(getRepositoryToken(WebhookEvent));
    subscriptionsService = module.get(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should return health statuses with healthy database', async () => {
      webhookRepo.manager.query.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealth();

      expect(webhookRepo.manager.query).toHaveBeenCalledWith('SELECT 1');
      expect(result.api).toBe('healthy');
      expect(result.database).toBe('healthy');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return down database status when query fails', async () => {
      webhookRepo.manager.query.mockRejectedValue(new Error('DB Error'));

      const result = await service.getHealth();

      expect(result.database).toBe('down');
    });

    it('should return degraded for elevenlabs and razorpay when env vars not set', async () => {
      const originalEnv = process.env;
      delete process.env.ELEVENLABS_API_KEY;
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;

      webhookRepo.manager.query.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealth();

      expect(result.elevenlabs).toBe('degraded');
      expect(result.razorpay).toBe('degraded');

      process.env = originalEnv;
    });
  });

  describe('getCosts', () => {
    it('should return placeholder cost data', () => {
      const result = service.getCosts();

      expect(result).toEqual({
        elevenlabs: { requests: 0, cost: 0 },
        gemini: { requests: 0, cost: 0 },
      });
    });
  });

  describe('getErrors', () => {
    it('should return webhook events with errors', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockWebhookEvent]),
      };

      webhookRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getErrors(10);

      expect(result).toEqual([mockWebhookEvent]);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('retryWebhook', () => {
    it('should call subscriptionsService.retryWebhook when webhook found', async () => {
      webhookRepo.findOne.mockResolvedValue(mockWebhookEvent);
      subscriptionsService.retryWebhook.mockResolvedValue(undefined);

      const result = await service.retryWebhook('webhook-1');

      expect(webhookRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
      });
      expect(subscriptionsService.retryWebhook).toHaveBeenCalledWith(
        'webhook-1',
      );
      expect(result).toEqual({
        success: true,
        message: 'Webhook reprocessed successfully',
      });
    });

    it('should throw NotFoundException when webhook not found', async () => {
      webhookRepo.findOne.mockResolvedValue(null);

      await expect(service.retryWebhook('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
