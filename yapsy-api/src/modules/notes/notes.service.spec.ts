import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';

describe('NotesService', () => {
  let service: NotesService;
  let noteRepository: jest.Mocked<Repository<Note>>;

  const mockNote: Note = {
    id: 'note-1',
    user_id: 'user-1',
    content: 'Test note content',
    follow_up_date: null,
    source: 'manual',
    journal_id: null,
    is_resolved: false,
    created_at: new Date(),
    updated_at: new Date(),
  } as Note;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteRepository = module.get(getRepositoryToken(Note));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save note', async () => {
      const dto: CreateNoteDto = {
        content: 'New note content',
        follow_up_date: '2026-02-20',
      };

      const createdNote = { ...mockNote, ...dto };
      noteRepository.create.mockReturnValue(createdNote as Note);
      noteRepository.save.mockResolvedValue(createdNote);

      const result = await service.create('user-1', dto);

      expect(noteRepository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        content: dto.content,
        follow_up_date: dto.follow_up_date,
        source: 'manual',
      });
      expect(noteRepository.save).toHaveBeenCalledWith(createdNote);
      expect(result).toEqual(createdNote);
    });

    it('should use default source manual when not provided', async () => {
      const dto: CreateNoteDto = {
        content: 'New note content',
      };

      const createdNote = { ...mockNote, ...dto, source: 'manual' };
      noteRepository.create.mockReturnValue(createdNote as Note);
      noteRepository.save.mockResolvedValue(createdNote);

      await service.create('user-1', dto);

      expect(noteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'manual',
        }),
      );
    });
  });

  describe('createFromVoice', () => {
    it('should create note from voice with journal_id', async () => {
      const content = 'Voice note content';
      const journalId = 'journal-1';
      const followUpDate = '2026-02-20';

      const createdNote = {
        ...mockNote,
        content,
        journal_id: journalId,
        source: 'voice',
        follow_up_date: followUpDate,
      };

      noteRepository.create.mockReturnValue(createdNote as Note);
      noteRepository.save.mockResolvedValue(createdNote);

      const result = await service.createFromVoice(
        'user-1',
        content,
        journalId,
        followUpDate,
      );

      expect(noteRepository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        content,
        journal_id: journalId,
        source: 'voice',
        follow_up_date: followUpDate,
      });
      expect(noteRepository.save).toHaveBeenCalledWith(createdNote);
      expect(result).toEqual(createdNote);
    });

    it('should create note from voice without follow_up_date', async () => {
      const content = 'Voice note content';
      const journalId = 'journal-1';

      const createdNote = {
        ...mockNote,
        content,
        journal_id: journalId,
        source: 'voice',
        follow_up_date: null,
      };

      noteRepository.create.mockReturnValue(createdNote as Note);
      noteRepository.save.mockResolvedValue(createdNote);

      const result = await service.createFromVoice(
        'user-1',
        content,
        journalId,
      );

      expect(noteRepository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        content,
        journal_id: journalId,
        source: 'voice',
        follow_up_date: undefined,
      });
      expect(result).toEqual(createdNote);
    });
  });

  describe('findOne', () => {
    it('should return note when found', async () => {
      noteRepository.findOne.mockResolvedValue(mockNote);

      const result = await service.findOne('user-1', 'note-1');

      expect(result).toEqual(mockNote);
      expect(noteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'note-1', user_id: 'user-1' },
      });
    });

    it('should throw NotFoundException when note not found', async () => {
      noteRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'note-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should find note, assign dto, and save', async () => {
      const dto: UpdateNoteDto = { content: 'Updated content' };
      const updatedNote = { ...mockNote, content: 'Updated content' };

      noteRepository.findOne.mockResolvedValue(mockNote);
      noteRepository.save.mockResolvedValue(updatedNote);

      const result = await service.update('user-1', 'note-1', dto);

      expect(noteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'note-1', user_id: 'user-1' },
      });
      expect(noteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'Updated content' }),
      );
      expect(result).toEqual(updatedNote);
    });
  });

  describe('remove', () => {
    it('should find note and remove', async () => {
      noteRepository.findOne.mockResolvedValue(mockNote);
      noteRepository.remove.mockResolvedValue(mockNote);

      await service.remove('user-1', 'note-1');

      expect(noteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'note-1', user_id: 'user-1' },
      });
      expect(noteRepository.remove).toHaveBeenCalledWith(mockNote);
    });
  });
});
