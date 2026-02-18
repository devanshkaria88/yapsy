import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  RazorpayService,
  RazorpaySubscriptionResponse,
} from './razorpay.service';

describe('RazorpayService', () => {
  let service: RazorpayService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    global.fetch = jest.fn();

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RazorpayService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RazorpayService>(RazorpayService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).fetch;
  });

  describe('createSubscription', () => {
    it('should create subscription and return response', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'razorpay.keyId') return 'key-id';
        if (key === 'razorpay.keySecret') return 'key-secret';
        return null;
      });

      const mockResponse: RazorpaySubscriptionResponse = {
        id: 'sub_123',
        plan_id: 'plan_123',
        status: 'created',
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await service.createSubscription('plan_123', 'cust_123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.razorpay.com/v1/subscriptions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'razorpay.keyId') return 'key-id';
        if (key === 'razorpay.keySecret') return 'key-secret';
        return null;
      });

      const mockFetchResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue('Bad Request'),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      await expect(service.createSubscription('plan_123')).rejects.toThrow(
        'Razorpay API error',
      );
    });
  });

  describe('verifyPaymentSignature', () => {
    it('should return true when signature matches', () => {
      configService.get.mockReturnValue('secret-key');

      const paymentId = 'pay_123';
      const subscriptionId = 'sub_123';
      const body = `${paymentId}|${subscriptionId}`;
      const expectedSignature = crypto
        .createHmac('sha256', 'secret-key')
        .update(body)
        .digest('hex');

      const result = service.verifyPaymentSignature(
        paymentId,
        subscriptionId,
        expectedSignature,
      );

      expect(result).toBe(true);
    });

    it('should return false when signature does not match', () => {
      configService.get.mockReturnValue('secret-key');

      const result = service.verifyPaymentSignature(
        'pay_123',
        'sub_123',
        'invalid-signature',
      );

      expect(result).toBe(false);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should return true when signature matches', () => {
      configService.get.mockReturnValue('webhook-secret');

      const body = '{"event":"subscription.created"}';
      const expectedSignature = crypto
        .createHmac('sha256', 'webhook-secret')
        .update(body)
        .digest('hex');

      const result = service.verifyWebhookSignature(body, expectedSignature);

      expect(result).toBe(true);
    });

    it('should return false when signature does not match', () => {
      configService.get.mockReturnValue('webhook-secret');

      const result = service.verifyWebhookSignature(
        '{"event":"subscription.created"}',
        'invalid-signature',
      );

      expect(result).toBe(false);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'razorpay.keyId') return 'key-id';
        if (key === 'razorpay.keySecret') return 'key-secret';
        return null;
      });

      const mockFetchResponse = {
        ok: true,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      await service.cancelSubscription('sub_123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.razorpay.com/v1/subscriptions/sub_123/cancel',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should throw error when cancel fails', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'razorpay.keyId') return 'key-id';
        if (key === 'razorpay.keySecret') return 'key-secret';
        return null;
      });

      const mockFetchResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Not Found'),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      await expect(service.cancelSubscription('sub_123')).rejects.toThrow(
        'Razorpay cancel error',
      );
    });
  });

  describe('getSubscription', () => {
    it('should return subscription details', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'razorpay.keyId') return 'key-id';
        if (key === 'razorpay.keySecret') return 'key-secret';
        return null;
      });

      const mockResponse: RazorpaySubscriptionResponse = {
        id: 'sub_123',
        plan_id: 'plan_123',
        status: 'active',
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await service.getSubscription('sub_123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.razorpay.com/v1/subscriptions/sub_123',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
