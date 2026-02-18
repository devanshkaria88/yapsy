import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from './auth.service';
import { AdminUser } from '../users/entities/admin-user.entity';
import { AdminRole } from '../../common/enums';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAdmin: AdminUser = {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: AdminRole.SUPER_ADMIN,
  } as AdminUser;

  const mockAdminAuthResponse = {
    access_token: 'admin-access-token',
    refresh_token: 'admin-refresh-token',
    admin: {
      id: 'admin-1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: AdminRole.SUPER_ADMIN,
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      adminFirebaseAuth: jest.fn(),
      adminRefreshTokens: jest.fn(),
      adminLogout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('firebaseAuth', () => {
    it('should call authService.adminFirebaseAuth with id_token', async () => {
      authService.adminFirebaseAuth.mockResolvedValue(mockAdminAuthResponse);

      const result = await controller.firebaseAuth({
        id_token: 'firebase-token',
      });

      expect(authService.adminFirebaseAuth).toHaveBeenCalledWith(
        'firebase-token',
      );
      expect(result).toEqual(mockAdminAuthResponse);
    });
  });

  describe('refresh', () => {
    it('should decode JWT and call authService.adminRefreshTokens', async () => {
      const payload = { sub: 'admin-1', email: 'admin@test.com' };
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        'base64',
      );
      const mockToken = `header.${encodedPayload}.signature`;
      authService.adminRefreshTokens.mockResolvedValue(mockAdminAuthResponse);

      const result = await controller.refresh({ refresh_token: mockToken });

      expect(authService.adminRefreshTokens).toHaveBeenCalledWith(
        'admin-1',
        mockToken,
      );
      expect(result).toEqual(mockAdminAuthResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.adminLogout and return success message', async () => {
      authService.adminLogout.mockResolvedValue(undefined);

      const result = await controller.logout(mockAdmin);

      expect(authService.adminLogout).toHaveBeenCalledWith('admin-1');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
