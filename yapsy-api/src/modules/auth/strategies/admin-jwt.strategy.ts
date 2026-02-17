import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { AdminUser } from '../../users/entities/admin-user.entity';

interface AdminJwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(AdminUser)
    private readonly adminUsersRepository: Repository<AdminUser>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('adminJwt.secret') ?? '',
    });
  }

  async validate(payload: AdminJwtPayload): Promise<AdminUser> {
    const admin = await this.adminUsersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!admin) throw new UnauthorizedException('Admin not found');
    return admin;
  }
}
