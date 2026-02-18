import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ElevenlabsService } from './elevenlabs.service';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

describe('ElevenlabsService', () => {
  let service: ElevenlabsService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    global.fetch = jest.fn();

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElevenlabsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ElevenlabsService>(ElevenlabsService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).fetch;
  });

  describe('getSignedUrl', () => {
    it('should return signed URL from API', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'elevenlabs.agentId') return 'agent-123';
        if (key === 'elevenlabs.apiKey') return 'api-key-123';
        return null;
      });

      const mockResponse = {
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ signed_url: 'https://signed-url.example.com' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getSignedUrl();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=agent-123',
        {
          method: 'GET',
          headers: { 'xi-api-key': 'api-key-123' },
        },
      );
      expect(result).toEqual({ signed_url: 'https://signed-url.example.com' });
    });

    it('should throw error when response is not ok', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'elevenlabs.agentId') return 'agent-123';
        if (key === 'elevenlabs.apiKey') return 'api-key-123';
        return null;
      });

      const mockResponse = {
        ok: false,
        status: 500,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(service.getSignedUrl()).rejects.toThrow(
        'Failed to get ElevenLabs signed URL',
      );
    });
  });

  describe('buildSessionConfig', () => {
    it('should return session config with user name in system prompt', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'elevenlabs.agentId') return 'agent-123';
        return null;
      });

      const user: User = {
        id: 'user-1',
        name: 'John Doe',
        timezone: 'America/New_York',
      } as User;

      const tasks: Task[] = [];

      const result = service.buildSessionConfig(user, tasks);

      expect(result).toEqual({
        agent_id: 'agent-123',
        system_prompt: expect.stringContaining('John Doe'),
      });
      expect(result.system_prompt).toContain('America/New_York');
      expect(result.system_prompt).toContain('No tasks scheduled for today.');
    });

    it('should include tasks in system prompt when provided', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'elevenlabs.agentId') return 'agent-123';
        return null;
      });

      const user: User = {
        id: 'user-1',
        name: 'Jane Smith',
        timezone: 'UTC',
      } as User;

      const tasks: Task[] = [
        {
          id: 'task-1',
          title: 'Complete project',
          status: 'pending' as any,
          priority: 'high' as any,
        } as Task,
      ];

      const result = service.buildSessionConfig(user, tasks);

      expect(result.system_prompt).toContain('Jane Smith');
      expect(result.system_prompt).toContain('Complete project');
      expect(result.system_prompt).toContain('task-1');
    });
  });
});
