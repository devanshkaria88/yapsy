import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateFcmTokenDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockProfile = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const mockUsersService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      updateFcmToken: jest.fn(),
      deleteAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should call usersService.getProfile', async () => {
      usersService.getProfile.mockResolvedValue(mockProfile as any);

      const result = await controller.getProfile('user-1');

      expect(usersService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should call usersService.updateProfile', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const updatedProfile = { ...mockProfile, name: 'Updated Name' };

      usersService.updateProfile.mockResolvedValue(updatedProfile as any);

      const result = await controller.updateProfile('user-1', dto);

      expect(usersService.updateProfile).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(updatedProfile);
    });
  });

  describe('updateFcmToken', () => {
    it('should call usersService.updateFcmToken and return message', async () => {
      const dto: UpdateFcmTokenDto = { fcm_token: 'new-token' };

      usersService.updateFcmToken.mockResolvedValue(undefined);

      const result = await controller.updateFcmToken('user-1', dto);

      expect(usersService.updateFcmToken).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ message: 'FCM token updated' });
    });
  });

  describe('deleteAccount', () => {
    it('should call usersService.deleteAccount and return message', async () => {
      usersService.deleteAccount.mockResolvedValue(undefined);

      const result = await controller.deleteAccount('user-1');

      expect(usersService.deleteAccount).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'Account deleted' });
    });
  });
});
