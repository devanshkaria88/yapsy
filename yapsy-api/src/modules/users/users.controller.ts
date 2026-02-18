import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import {
  UpdateFcmTokenDto,
  UpdateUserDto,
  UserProfileResponseDto,
} from './dto';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { UsersService } from './users.service';

@Controller('api/v1/mobile/users')
@MobileApi('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/fcm-token')
  @ApiOperation({ summary: 'Update FCM token for push notifications' })
  @ApiResponse({
    status: 200,
    description: 'FCM token updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateFcmToken(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    await this.usersService.updateFcmToken(userId, dto);
    return { message: 'FCM token updated' };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@CurrentUser('id') userId: string) {
    await this.usersService.deleteAccount(userId);
    return { message: 'Account deleted' };
  }
}
