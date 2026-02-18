import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  AuthUserDto,
  FirebaseAuthDto,
  OnboardingDto,
  RefreshTokenDto,
} from './dto';
import { MessageResponseDto } from '../../common/dto/message-response.dto';

@Controller('api/v1/mobile/auth')
@MobileApi('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase')
  @ApiOperation({
    summary: 'Authenticate with Firebase',
    description:
      'Exchange a Firebase ID token (from Google/Apple sign-in) for backend JWT tokens. Creates a new user on first login.',
  })
  @ApiResponse({
    status: 201,
    description: 'Auth successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired Firebase token',
  })
  async firebaseAuth(@Body() dto: FirebaseAuthDto): Promise<AuthResponseDto> {
    return this.authService.firebaseAuth(dto.id_token);
  }

  @Post('onboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Complete onboarding',
    description:
      'Submit name, date of birth, and gender after first sign-in. Sets is_onboarded to true.',
  })
  @ApiResponse({
    status: 201,
    description: 'Onboarding completed',
    type: AuthUserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async onboard(
    @CurrentUser() user: User,
    @Body() dto: OnboardingDto,
  ): Promise<AuthUserDto> {
    return this.authService.completeOnboarding(user.id, dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Exchange a valid refresh token for a new token pair.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // Decode the refresh token to extract user ID without verification
    // (verification happens inside refreshTokens via bcrypt comparison)
    const payload = this.decodeRefreshToken(dto.refresh_token);
    return this.authService.refreshTokens(payload.sub, dto.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({
    status: 201,
    description: 'Logged out successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() user: User): Promise<{ message: string }> {
    await this.authService.logout(user.id);
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
