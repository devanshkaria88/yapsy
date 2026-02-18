import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { SaveConversationDto } from './dto';
import { Journal } from '../journals/entities/journal.entity';

describe('ConversationsController', () => {
  let controller: ConversationsController;
  let conversationsService: jest.Mocked<ConversationsService>;

  const mockJournal: Journal = {
    id: 'journal-1',
    user_id: 'user-1',
    date: '2026-02-18',
    processing_status: 'processing',
  } as Journal;

  beforeEach(async () => {
    const mockConversationsService = {
      prepareSession: jest.fn(),
      saveConversation: jest.fn(),
      getProcessingStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
      ],
    }).compile();

    controller = module.get<ConversationsController>(ConversationsController);
    conversationsService = module.get(ConversationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('prepare', () => {
    it('should call conversationsService.prepareSession', async () => {
      const mockResult = {
        signed_url: 'https://signed-url.example.com',
        session_config: { agent_id: 'agent-123' },
      };

      conversationsService.prepareSession.mockResolvedValue(mockResult);

      const result = await controller.prepare('user-1');

      expect(conversationsService.prepareSession).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('saveConversation', () => {
    it('should call conversationsService.saveConversation', async () => {
      const dto: SaveConversationDto = {
        conversation_id: 'conv-123',
        transcript: [],
        duration_seconds: 120,
      };

      conversationsService.saveConversation.mockResolvedValue(mockJournal);

      const result = await controller.saveConversation('user-1', dto);

      expect(conversationsService.saveConversation).toHaveBeenCalledWith(
        'user-1',
        dto,
      );
      expect(result).toEqual(mockJournal);
    });
  });

  describe('getProcessingStatus', () => {
    it('should call conversationsService.getProcessingStatus', async () => {
      const mockResult = { processing_status: 'completed' };

      conversationsService.getProcessingStatus.mockResolvedValue(mockResult);

      const result = await controller.getProcessingStatus(
        'user-1',
        'journal-1',
      );

      expect(conversationsService.getProcessingStatus).toHaveBeenCalledWith(
        'user-1',
        'journal-1',
      );
      expect(result).toEqual(mockResult);
    });
  });
});
