import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto, UpdateFcmTokenDto } from './dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    firebase_uid: 'firebase-uid-1',
    avatar_url: 'https://example.com/avatar.jpg',
    auth_provider: 'google',
    subscription_status: 'free' as any,
    is_onboarded: true,
    gender: null,
    date_of_birth: '1990-01-01',
    timezone: 'UTC',
    refresh_token_hash: 'hashed-token',
    fcm_token: 'fcm-token-123',
    current_streak: 5,
    total_check_ins: 10,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');

      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('user-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should call findOne with lowercased email', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);

      await service.findByEmail('Test@Example.com');

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return user when found', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return user without refresh_token_hash', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1');

      expect(result).not.toHaveProperty('refresh_token_hash');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should call findById, then update, then getProfile', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      usersRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser);
      usersRepository.update.mockResolvedValue(undefined);

      const result = await service.updateProfile('user-1', dto);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(usersRepository.update).toHaveBeenCalledWith('user-1', dto);
      expect(result).not.toHaveProperty('refresh_token_hash');
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('updateFcmToken', () => {
    it('should update fcm_token', async () => {
      const dto: UpdateFcmTokenDto = { fcm_token: 'new-fcm-token' };

      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(undefined);

      await service.updateFcmToken('user-1', dto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(usersRepository.update).toHaveBeenCalledWith('user-1', {
        fcm_token: 'new-fcm-token',
      });
    });
  });

  describe('deleteAccount', () => {
    it('should call softDelete', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.softDelete.mockResolvedValue(undefined);

      await service.deleteAccount('user-1');

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(usersRepository.softDelete).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOneAdmin', () => {
    it('should return user without refresh_token_hash', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneAdmin('user-1');

      expect(result).not.toHaveProperty('refresh_token_hash');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneAdmin('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
