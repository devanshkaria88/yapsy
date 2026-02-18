import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SuperAdminGuard } from './super-admin.guard';
import { AdminRole } from '../enums';
import { AdminUser } from '../../modules/users/entities/admin-user.entity';

describe('SuperAdminGuard', () => {
  let guard: SuperAdminGuard;
  let mockExecutionContext: ExecutionContext;

  const createMockExecutionContext = (user?: AdminUser): ExecutionContext => {
    const mockRequest = {
      user,
    };

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperAdminGuard],
    }).compile();

    guard = module.get<SuperAdminGuard>(SuperAdminGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when user role is SUPER_ADMIN', () => {
      const user = {
        role: AdminRole.SUPER_ADMIN,
      } as AdminUser;
      mockExecutionContext = createMockExecutionContext(user);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user role is not SUPER_ADMIN', () => {
      const user = {
        role: AdminRole.MODERATOR,
      } as AdminUser;
      mockExecutionContext = createMockExecutionContext(user);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Super admin access required',
      );
    });

    it('should throw ForbiddenException when no user on request', () => {
      mockExecutionContext = createMockExecutionContext(undefined);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Super admin access required',
      );
    });

    it('should throw ForbiddenException when user is null', () => {
      mockExecutionContext = createMockExecutionContext(
        null as unknown as AdminUser,
      );

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });
});
