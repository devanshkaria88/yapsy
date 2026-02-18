import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SubscriptionGuard, SUBSCRIPTION_REQUIRED } from './subscription.guard';
import { SubscriptionStatus } from '../enums';
import { User } from '../../modules/users/entities/user.entity';

describe('SubscriptionGuard', () => {
  let guard: SubscriptionGuard;
  let _reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const createMockExecutionContext = (user?: User): ExecutionContext => {
    const mockRequest = {
      user,
    };

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<SubscriptionGuard>(SubscriptionGuard);
    _reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when requiresPro metadata is false', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockExecutionContext = createMockExecutionContext();

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        'requiresPro',
        expect.any(Array),
      );
    });

    it('should return true when requiresPro metadata is undefined', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      mockExecutionContext = createMockExecutionContext();

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when requiresPro is true and user is not pro', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const user = {
        subscription_status: SubscriptionStatus.FREE,
      } as User;
      mockExecutionContext = createMockExecutionContext(user);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        expect.objectContaining({
          response: expect.objectContaining({
            code: SUBSCRIPTION_REQUIRED,
          }),
        }),
      );
    });

    it('should throw ForbiddenException when requiresPro is true and user has cancelled subscription', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const user = {
        subscription_status: SubscriptionStatus.CANCELLED,
      } as User;
      mockExecutionContext = createMockExecutionContext(user);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should return true when requiresPro is true and user is pro', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const user = {
        subscription_status: SubscriptionStatus.PRO,
      } as User;
      mockExecutionContext = createMockExecutionContext(user);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when requiresPro is true and no user on request', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockExecutionContext = createMockExecutionContext(undefined);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        expect.objectContaining({
          response: expect.objectContaining({
            code: SUBSCRIPTION_REQUIRED,
          }),
        }),
      );
    });
  });
});
