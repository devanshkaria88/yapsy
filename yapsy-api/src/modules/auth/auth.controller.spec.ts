import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SubscriptionStatus } from '../../common/enums';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@test.com',
  } as User;

  const mockAuthResponse = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    user: {
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      avatar_url: null,
      subscription_status: SubscriptionStatus.FREE,
      is_onboarded: false,
      gender: null,
      date_of_birth: null,
    },
  };

  const mockAuthUserDto = {
    id: 'user-1',
    email: 'test@test.com',
    name: 'Updated Name',
    avatar_url: null,
    subscription_status: SubscriptionStatus.FREE,
    is_onboarded: true,
    gender: 'male' as const,
    date_of_birth: '1998-05-15',
  };

  beforeEach(async () => {
    const mockAuthService = {
      firebaseAuth: jest.fn(),
      completeOnboarding: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('firebaseAuth', () => {
    it('should call authService.firebaseAuth with id_token', async () => {
      authService.firebaseAuth.mockResolvedValue(mockAuthResponse);

      const result = await controller.firebaseAuth({
        id_token: 'firebase-token',
      });

      expect(authService.firebaseAuth).toHaveBeenCalledWith('firebase-token');
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('onboard', () => {
    it('should call authService.completeOnboarding with user.id', async () => {
      const dto = {
        name: 'Updated Name',
        date_of_birth: '1998-05-15',
        gender: 'male' as const,
        timezone: 'Asia/Kolkata',
      };
      authService.completeOnboarding.mockResolvedValue(mockAuthUserDto);

      const result = await controller.onboard(mockUser, dto);

      expect(authService.completeOnboarding).toHaveBeenCalledWith(
        'user-1',
        dto,
      );
      expect(result).toEqual(mockAuthUserDto);
    });
  });

  describe('refresh', () => {
    it('should decode base64 JWT payload and call authService.refreshTokens', async () => {
      const payload = { sub: 'user-1', email: 'test@test.com' };
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        'base64',
      );
      const mockToken = `header.${encodedPayload}.signature`;
      authService.refreshTokens.mockResolvedValue(mockAuthResponse);

      const result = await controller.refresh({ refresh_token: mockToken });

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        'user-1',
        mockToken,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout and return success message', async () => {
      authService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockUser);

      expect(authService.logout).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
