import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminApi, CurrentUser } from '../../common/decorators';
import { AdminJwtAuthGuard } from '../../common/guards';
import { AdminUser } from '../users/entities/admin-user.entity';
import { AuthService } from './auth.service';
import { AdminAuthResponseDto, FirebaseAuthDto, RefreshTokenDto } from './dto';

@Controller('api/v1/admin/auth')
@AdminApi('Admin Auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase')
  @ApiOperation({
    summary: 'Admin authenticate with Firebase',
    description:
      'Exchange a Firebase ID token for admin JWT tokens. The email must exist in admin_users table.',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin auth successful',
    type: AdminAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
  @ApiResponse({ status: 403, description: 'No admin account for this email' })
  async firebaseAuth(
    @Body() dto: FirebaseAuthDto,
  ): Promise<AdminAuthResponseDto> {
    return this.authService.adminFirebaseAuth(dto.id_token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed',
    type: AdminAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AdminAuthResponseDto> {
    const payload = this.decodeRefreshToken(dto.refresh_token);
    return this.authService.adminRefreshTokens(payload.sub, dto.refresh_token);
  }

  @Post('logout')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Admin logout and invalidate refresh token' })
  @ApiResponse({ status: 201, description: 'Logged out' })
  async logout(@CurrentUser() admin: AdminUser): Promise<{ message: string }> {
    await this.authService.adminLogout(admin.id);
    return { message: 'Logged out' };
  }

  // ────────────────────────────────────────────────────────────────────

  private decodeRefreshToken(token: string): { sub: string; email: string } {
    try {
      const decoded = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      ) as { sub: string; email: string };
      return { sub: decoded.sub, email: decoded.email };
    } catch {
      throw new Error('Invalid refresh token format');
    }
  }
}
