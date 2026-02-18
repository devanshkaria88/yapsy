import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteQueryDto } from './dto';
import { Note } from './entities/note.entity';

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: jest.Mocked<NotesService>;

  const mockNote: Note = {
    id: 'note-1',
    user_id: 'user-1',
    content: 'Test note content',
    follow_up_date: null,
    source: 'manual',
    journal_id: null,
    is_resolved: false,
  } as Note;

  beforeEach(async () => {
    const mockNotesService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get(NotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call notesService.findAll', async () => {
      const query: NoteQueryDto = { page: 1, limit: 20 };
      const mockResult = { items: [mockNote], meta: {} } as any;

      notesService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll('user-1', query);

      expect(notesService.findAll).toHaveBeenCalledWith('user-1', query);
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('should call notesService.create', async () => {
      const dto: CreateNoteDto = {
        content: 'New note content',
      };

      notesService.create.mockResolvedValue(mockNote);

      const result = await controller.create('user-1', dto);

      expect(notesService.create).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(mockNote);
    });
  });

  describe('update', () => {
    it('should call notesService.update', async () => {
      const dto: UpdateNoteDto = { content: 'Updated content' };
      const updatedNote = { ...mockNote, content: 'Updated content' };

      notesService.update.mockResolvedValue(updatedNote);

      const result = await controller.update('user-1', 'note-1', dto);

      expect(notesService.update).toHaveBeenCalledWith('user-1', 'note-1', dto);
      expect(result).toEqual(updatedNote);
    });
  });

  describe('remove', () => {
    it('should call notesService.remove and return message', async () => {
      notesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('user-1', 'note-1');

      expect(notesService.remove).toHaveBeenCalledWith('user-1', 'note-1');
      expect(result).toEqual({ message: 'Note deleted' });
    });
  });
});
