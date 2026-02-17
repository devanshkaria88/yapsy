import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateNoteDto, NoteQueryDto, UpdateNoteDto } from './dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(userId: string, dto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create({
      user_id: userId,
      content: dto.content,
      follow_up_date: dto.follow_up_date,
      source: dto.source ?? 'manual',
    });
    return this.noteRepository.save(note);
  }

  async createFromVoice(
    userId: string,
    content: string,
    journalId: string,
    followUpDate?: string,
  ): Promise<Note> {
    const note = this.noteRepository.create({
      user_id: userId,
      content,
      journal_id: journalId,
      source: 'voice',
      follow_up_date: followUpDate,
    });
    return this.noteRepository.save(note);
  }

  async findAll(
    userId: string,
    query: NoteQueryDto,
  ): Promise<PaginatedResult<Note>> {
    const { page = 1, limit = 20, is_resolved, source } = query;

    const qb = this.noteRepository
      .createQueryBuilder('note')
      .where('note.user_id = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('note.created_at', 'DESC');

    if (is_resolved !== undefined) {
      qb.andWhere('note.is_resolved = :is_resolved', { is_resolved });
    }
    if (source) {
      qb.andWhere('note.source = :source', { source });
    }

    const [items, total] = await qb.getManyAndCount();
    return new PaginatedResult(items, total, page, limit);
  }

  async findOne(userId: string, noteId: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user_id: userId },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(
    userId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<Note> {
    const note = await this.findOne(userId, noteId);
    Object.assign(note, dto);
    return this.noteRepository.save(note);
  }

  async remove(userId: string, noteId: string): Promise<void> {
    const note = await this.findOne(userId, noteId);
    await this.noteRepository.remove(note);
  }
}
