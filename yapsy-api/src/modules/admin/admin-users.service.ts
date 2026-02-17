import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../users/entities/admin-user.entity';
import { CreateAdminDto, UpdateAdminRoleDto } from './dto';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
  ) {}

  /** List all admin users, ordered by creation date descending. */
  async findAll(): Promise<AdminUser[]> {
    return this.adminRepo.find({
      order: { created_at: 'DESC' },
      select: ['id', 'email', 'name', 'role', 'created_at', 'updated_at'],
    });
  }

  /** Create a new admin user. Email must be unique. */
  async create(dto: CreateAdminDto): Promise<AdminUser> {
    const existing = await this.adminRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException(`Admin with email ${dto.email} already exists`);
    }

    const admin = this.adminRepo.create({
      email: dto.email.toLowerCase(),
      name: dto.name,
      role: dto.role,
    });

    const saved = await this.adminRepo.save(admin);
    this.logger.log(`Admin user created: ${saved.email} (${saved.role})`);

    return saved;
  }

  /** Update an admin user's role. Cannot demote yourself. */
  async updateRole(
    adminId: string,
    dto: UpdateAdminRoleDto,
    currentAdminId: string,
  ): Promise<AdminUser> {
    if (adminId === currentAdminId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    admin.role = dto.role;
    const updated = await this.adminRepo.save(admin);
    this.logger.log(`Admin ${admin.email} role updated to ${dto.role}`);

    return updated;
  }

  /** Remove an admin user. Cannot delete yourself. */
  async remove(adminId: string, currentAdminId: string): Promise<void> {
    if (adminId === currentAdminId) {
      throw new ForbiddenException('Cannot delete your own admin account');
    }

    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    await this.adminRepo.remove(admin);
    this.logger.log(`Admin user removed: ${admin.email}`);
  }
}
