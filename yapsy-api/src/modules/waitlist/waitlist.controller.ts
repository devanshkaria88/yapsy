import { Body, Controller, Get, Ip, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistEntryDto } from './dto';

@Controller('api/v1/waitlist')
@ApiTags('Waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @ApiOperation({ summary: 'Join the waitlist' })
  @ApiResponse({ status: 201, description: 'Successfully joined the waitlist' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  @ApiResponse({ status: 409, description: 'Already on the waitlist' })
  async signup(@Body() dto: CreateWaitlistEntryDto, @Ip() ip: string) {
    await this.waitlistService.signup(dto, ip);
    return { success: true, message: "You're on the list!" };
  }

  @Get('count')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get waitlist count' })
  @ApiResponse({ status: 200, description: 'Returns current waitlist count' })
  async getCount() {
    const count = await this.waitlistService.getCount();
    return { count };
  }
}
