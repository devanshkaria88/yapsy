import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SubscriptionStatus } from '../../common/enums';
import { AdminUser } from '../users/entities/admin-user.entity';
import { User } from '../users/entities/user.entity';
import { FirebaseService } from './firebase.service';
import {
  AdminAuthResponseDto,
  AuthResponseDto,
  AuthUserDto,
  OnboardingDto,
} from './dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(AdminUser)
    private readonly adminUsersRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  // ─── Mobile: Firebase Auth ──────────────────────────────────────────

  /**
   * Exchange a Firebase ID token for backend JWT tokens.
   * Creates the user on first login (find-or-create by firebase_uid).
   */
  async firebaseAuth(idToken: string): Promise<AuthResponseDto> {
    const fbUser = await this.firebaseService.verifyIdToken(idToken);

    let user = await this.usersRepository.findOne({
      where: { firebase_uid: fbUser.uid },
    });

    if (!user) {
      // Check if a user with this email already exists (edge case: migrated accounts)
      user = await this.usersRepository.findOne({
        where: { email: fbUser.email.toLowerCase() },
      });

      if (user) {
        // Link Firebase UID to existing account
        user.firebase_uid = fbUser.uid;
        if (fbUser.picture && !user.avatar_url) {
          user.avatar_url = fbUser.picture;
        }
        await this.usersRepository.save(user);
      } else {
        // Brand new user
        user = this.usersRepository.create({
          firebase_uid: fbUser.uid,
          email: fbUser.email.toLowerCase(),
          name: fbUser.name ?? undefined,
          avatar_url: fbUser.picture ?? undefined,
          auth_provider: this.normalizeProvider(fbUser.provider),
          subscription_status: SubscriptionStatus.FREE,
          is_onboarded: false,
        });
        await this.usersRepository.save(user);
        this.logger.log(
          `New user created: ${user.email} via ${fbUser.provider}`,
        );
      }
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: this.toAuthUserDto(user),
    };
  }

  // ─── Mobile: Onboarding ─────────────────────────────────────────────

  /**
   * Complete user onboarding with basic profile info.
   * Sets is_onboarded = true.
   */
  async completeOnboarding(
    userId: string,
    dto: OnboardingDto,
  ): Promise<AuthUserDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.name = dto.name;
    user.date_of_birth = dto.date_of_birth;
    user.gender = dto.gender;
    if (dto.timezone) {
      user.timezone = dto.timezone;
    }
    user.is_onboarded = true;

    await this.usersRepository.save(user);
    this.logger.log(`User ${user.email} completed onboarding`);

    return this.toAuthUserDto(user);
  }

  // ─── Mobile: Refresh & Logout ───────────────────────────────────────

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Access denied');
    }

    const valid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!valid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: this.toAuthUserDto(user),
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refresh_token_hash: null as unknown as string,
    });
  }

  // ─── Admin: Firebase Auth ───────────────────────────────────────────

  /**
   * Exchange a Firebase ID token for admin JWT tokens.
   * The admin must already exist in admin_users (matched by email).
   */
  async adminFirebaseAuth(idToken: string): Promise<AdminAuthResponseDto> {
    const fbUser = await this.firebaseService.verifyIdToken(idToken);

    // Find admin by firebase_uid first, then by email
    let admin = await this.adminUsersRepository.findOne({
      where: { firebase_uid: fbUser.uid },
    });

    if (!admin) {
      // Try matching by email (first-time Firebase login for a pre-seeded admin)
      admin = await this.adminUsersRepository.findOne({
        where: { email: fbUser.email.toLowerCase() },
      });

      if (!admin) {
        throw new ForbiddenException(
          'No admin account found for this email. Contact a super admin.',
        );
      }

      // Link Firebase UID on first login
      admin.firebase_uid = fbUser.uid;
      await this.adminUsersRepository.save(admin);
      this.logger.log(`Admin ${admin.email} linked to Firebase UID`);
    }

    const tokens = this.generateAdminTokens(admin.id, admin.email);
    await this.updateAdminRefreshToken(admin.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  // ─── Admin: Refresh & Logout ────────────────────────────────────────

  async adminRefreshTokens(
    adminId: string,
    refreshToken: string,
  ): Promise<AdminAuthResponseDto> {
    const admin = await this.adminUsersRepository.findOne({
      where: { id: adminId },
    });
    if (!admin || !admin.refresh_token_hash) {
      throw new UnauthorizedException('Access denied');
    }

    const valid = await bcrypt.compare(refreshToken, admin.refresh_token_hash);
    if (!valid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = this.generateAdminTokens(admin.id, admin.email);
    await this.updateAdminRefreshToken(admin.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async adminLogout(adminId: string): Promise<void> {
    await this.adminUsersRepository.update(adminId, {
      refresh_token_hash: null as unknown as string,
    });
  }

  // ─── Private helpers ────────────────────────────────────────────────

  private generateTokens(
    userId: string,
    email: string,
  ): { access_token: string; refresh_token: string } {
    const payload = { sub: userId, email };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.parseExpiry(
        this.configService.get<string>('jwt.expiresIn') ?? '15m',
      ),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.parseExpiry(
        this.configService.get<string>('jwt.refreshExpiresIn') ?? '30d',
      ),
    });
    return { access_token, refresh_token };
  }

  private generateAdminTokens(
    adminId: string,
    email: string,
  ): { access_token: string; refresh_token: string } {
    const payload = { sub: adminId, email };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('adminJwt.secret'),
      expiresIn: this.parseExpiry(
        this.configService.get<string>('adminJwt.expiresIn') ?? '1h',
      ),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('adminJwt.refreshSecret'),
      expiresIn: this.parseExpiry(
        this.configService.get<string>('adminJwt.refreshExpiresIn') ?? '7d',
      ),
    });
    return { access_token, refresh_token };
  }

  /**
   * Parse expiry strings like '15m', '1h', '30d' into seconds.
   */
  private parseExpiry(value: string): number {
    const match = value.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 900; // default 15 minutes
    const num = parseInt(match[1], 10);
    switch (match[2]) {
      case 's':
        return num;
      case 'm':
        return num * 60;
      case 'h':
        return num * 3600;
      case 'd':
        return num * 86400;
      default:
        return 900;
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.usersRepository.update(userId, { refresh_token_hash: hash });
  }

  private async updateAdminRefreshToken(
    adminId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.adminUsersRepository.update(adminId, {
      refresh_token_hash: hash,
    });
  }

  private toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      avatar_url: user.avatar_url ?? null,
      subscription_status: user.subscription_status,
      is_onboarded: user.is_onboarded,
      gender: user.gender ?? null,
      date_of_birth: user.date_of_birth ?? null,
    };
  }

  /**
   * Normalise Firebase provider strings to short names.
   * e.g. 'google.com' → 'google', 'apple.com' → 'apple'
   */
  private normalizeProvider(provider: string): string {
    if (provider.includes('google')) return 'google';
    if (provider.includes('apple')) return 'apple';
    if (provider === 'password') return 'email';
    return provider;
  }
}
