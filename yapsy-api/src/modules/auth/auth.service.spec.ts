import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { User } from '../users/entities/user.entity';
import { AdminUser } from '../users/entities/admin-user.entity';
import { SubscriptionStatus } from '../../common/enums';
import { AdminRole } from '../../common/enums';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<Repository<User>>;
  let adminUsersRepository: jest.Mocked<Repository<AdminUser>>;
  let _jwtService: jest.Mocked<JwtService>;
  let _configService: jest.Mocked<ConfigService>;
  let firebaseService: jest.Mocked<FirebaseService>;

  const mockUser: User = {
    id: 'user-1',
    firebase_uid: 'firebase-uid-1',
    email: 'test@test.com',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    auth_provider: 'google',
    subscription_status: SubscriptionStatus.FREE,
    is_onboarded: false,
    gender: null,
    date_of_birth: null,
    timezone: null,
    refresh_token_hash: 'hashed-refresh-token',
    fcm_token: null,
    current_streak: 0,
    total_check_ins: 0,
    weekly_check_in_count: 0,
    weekly_check_in_reset_date: null,
    last_check_in_date: null,
    razorpay_customer_id: null,
    razorpay_subscription_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  const mockAdminUser: AdminUser = {
    id: 'admin-1',
    firebase_uid: 'firebase-admin-uid-1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: AdminRole.SUPER_ADMIN,
    refresh_token_hash: 'hashed-refresh-token',
    created_at: new Date(),
    updated_at: new Date(),
  } as AdminUser;

  const mockFirebaseUser = {
    uid: 'firebase-uid-1',
    email: 'test@test.com',
    name: 'Test User',
    picture: 'https://example.com/picture.jpg',
    provider: 'google.com',
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockAdminUsersRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          'jwt.secret': 'jwt-secret',
          'jwt.expiresIn': '15m',
          'jwt.refreshSecret': 'jwt-refresh-secret',
          'jwt.refreshExpiresIn': '30d',
          'adminJwt.secret': 'admin-jwt-secret',
          'adminJwt.expiresIn': '1h',
          'adminJwt.refreshSecret': 'admin-jwt-refresh-secret',
          'adminJwt.refreshExpiresIn': '7d',
        };
        return config[key];
      }),
    };

    const mockFirebaseService = {
      verifyIdToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(AdminUser),
          useValue: mockAdminUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    adminUsersRepository = module.get(getRepositoryToken(AdminUser));
    _jwtService = module.get<JwtService>(JwtService);
    _configService = module.get<ConfigService>(ConfigService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('firebaseAuth', () => {
    it('should call firebaseService.verifyIdToken', async () => {
      firebaseService.verifyIdToken.mockResolvedValue(mockFirebaseUser);
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(undefined);

      await service.firebaseAuth('id-token');

      expect(firebaseService.verifyIdToken).toHaveBeenCalledWith('id-token');
    });

    it('should return tokens and user when user found by firebase_uid', async () => {
      firebaseService.verifyIdToken.mockResolvedValue(mockFirebaseUser);
      usersRepository.findOne.mockResolvedValueOnce(mockUser);
      usersRepository.update.mockResolvedValue(undefined);

      const result = await service.firebaseAuth('id-token');

      expect(result).toHaveProperty('access_token', 'mock-token');
      expect(result).toHaveProperty('refresh_token', 'mock-token');
      expect(result.user.id).toBe('user-1');
      expect(result.user.email).toBe('test@test.com');
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { firebase_uid: 'firebase-uid-1' },
      });
    });

    it('should link firebase_uid when user found by email but not firebase_uid', async () => {
      const userWithoutFirebaseUid = { ...mockUser, firebase_uid: null };
      firebaseService.verifyIdToken.mockResolvedValue(mockFirebaseUser);
      usersRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(userWithoutFirebaseUid);
      usersRepository.save.mockResolvedValue({
        ...userWithoutFirebaseUid,
        firebase_uid: 'firebase-uid-1',
      });
      usersRepository.update.mockResolvedValue(undefined);

      await service.firebaseAuth('id-token');

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ firebase_uid: 'firebase-uid-1' }),
      );
    });

    it('should create new user with SubscriptionStatus.FREE when user not found', async () => {
      const newUser = { ...mockUser, id: 'user-2', is_onboarded: false };
      firebaseService.verifyIdToken.mockResolvedValue(mockFirebaseUser);
      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.create.mockReturnValue(newUser);
      usersRepository.save.mockResolvedValue(newUser);
      usersRepository.update.mockResolvedValue(undefined);

      await service.firebaseAuth('id-token');

      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firebase_uid: 'firebase-uid-1',
          email: 'test@test.com',
          subscription_status: SubscriptionStatus.FREE,
          is_onboarded: false,
        }),
      );
      expect(usersRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should return AuthResponseDto with access_token, refresh_token, and user', async () => {
      firebaseService.verifyIdToken.mockResolvedValue(mockFirebaseUser);
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(undefined);

      const result = await service.firebaseAuth('id-token');

      expect(result).toEqual({
        access_token: 'mock-token',
        refresh_token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'test@test.com',
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
          subscription_status: SubscriptionStatus.FREE,
          is_onboarded: false,
          gender: null,
          date_of_birth: null,
        },
      });
    });
  });

  describe('completeOnboarding', () => {
    const onboardingDto = {
      name: 'Updated Name',
      date_of_birth: '1998-05-15',
      gender: 'male' as const,
      timezone: 'Asia/Kolkata',
    };

    it('should find user and update onboarding fields', async () => {
      const updatedUser = { ...mockUser, ...onboardingDto, is_onboarded: true };
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.completeOnboarding('user-1', onboardingDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          date_of_birth: '1998-05-15',
          gender: 'male',
          timezone: 'Asia/Kolkata',
          is_onboarded: true,
        }),
      );
      expect(result.is_onboarded).toBe(true);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.completeOnboarding('user-1', onboardingDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.refreshTokens('user-1', 'refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh_token_hash is null', async () => {
      const userWithoutRefreshToken = { ...mockUser, refresh_token_hash: null };
      usersRepository.findOne.mockResolvedValue(userWithoutRefreshToken);

      await expect(
        service.refreshTokens('user-1', 'refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when bcrypt.compare returns false', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      usersRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.refreshTokens('user-1', 'refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return new tokens when refresh token is valid', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(undefined);

      const result = await service.refreshTokens('user-1', 'refresh-token');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'refresh-token',
        'hashed-refresh-token',
      );
      expect(result).toHaveProperty('access_token', 'mock-token');
      expect(result).toHaveProperty('refresh_token', 'mock-token');
      expect(result.user.id).toBe('user-1');
    });
  });

  describe('logout', () => {
    it('should call usersRepository.update with null refresh_token_hash', async () => {
      usersRepository.update.mockResolvedValue(undefined);

      await service.logout('user-1');

      expect(usersRepository.update).toHaveBeenCalledWith('user-1', {
        refresh_token_hash: null,
      });
    });
  });

  describe('adminFirebaseAuth', () => {
    it('should find admin by firebase_uid and return tokens', async () => {
      firebaseService.verifyIdToken.mockResolvedValue({
        ...mockFirebaseUser,
        uid: 'firebase-admin-uid-1',
        email: 'admin@test.com',
      });
      adminUsersRepository.findOne.mockResolvedValue(mockAdminUser);
      adminUsersRepository.update.mockResolvedValue(undefined);

      const result = await service.adminFirebaseAuth('id-token');

      expect(adminUsersRepository.findOne).toHaveBeenCalledWith({
        where: { firebase_uid: 'firebase-admin-uid-1' },
      });
      expect(result).toHaveProperty('access_token', 'mock-token');
      expect(result).toHaveProperty('refresh_token', 'mock-token');
      expect(result.admin.id).toBe('admin-1');
    });

    it('should find admin by email when firebase_uid not found', async () => {
      const adminWithoutFirebaseUid = { ...mockAdminUser, firebase_uid: null };
      firebaseService.verifyIdToken.mockResolvedValue({
        ...mockFirebaseUser,
        uid: 'new-firebase-uid',
        email: 'admin@test.com',
      });
      adminUsersRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(adminWithoutFirebaseUid);
      adminUsersRepository.save.mockResolvedValue({
        ...adminWithoutFirebaseUid,
        firebase_uid: 'new-firebase-uid',
      });
      adminUsersRepository.update.mockResolvedValue(undefined);

      await service.adminFirebaseAuth('id-token');

      expect(adminUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'admin@test.com' },
      });
      expect(adminUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ firebase_uid: 'new-firebase-uid' }),
      );
    });

    it('should throw ForbiddenException when no admin found', async () => {
      firebaseService.verifyIdToken.mockResolvedValue({
        ...mockFirebaseUser,
        email: 'unknown@test.com',
      });
      adminUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.adminFirebaseAuth('id-token')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('adminLogout', () => {
    it('should call adminUsersRepository.update with null refresh_token_hash', async () => {
      adminUsersRepository.update.mockResolvedValue(undefined);

      await service.adminLogout('admin-1');

      expect(adminUsersRepository.update).toHaveBeenCalledWith('admin-1', {
        refresh_token_hash: null,
      });
    });
  });
});
