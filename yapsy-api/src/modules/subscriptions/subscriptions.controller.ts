import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, MobileApi } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import {
  CreateSubscriptionDto,
  VerifyPaymentDto,
  SubscriptionPlanResponseDto,
  SubscriptionStatusResponseDto,
  CreateSubscriptionResponseDto,
  VerifyPaymentResponseDto,
  CancelSubscriptionResponseDto,
} from './dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/v1/mobile/subscriptions')
@MobileApi('Subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'List of active plans',
    type: [SubscriptionPlanResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current user subscription status' })
  @ApiResponse({
    status: 200,
    description: 'Subscription status with plan details',
    type: SubscriptionStatusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStatus(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getStatus(userId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created, returns short_url for payment',
    type: CreateSubscriptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid plan or request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSubscription(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(userId, dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment after subscription' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
    type: VerifyPaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature or subscription',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  verifyPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.subscriptionsService.verifyPayment(userId, dto);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled',
    type: CancelSubscriptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'No active subscription' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancelSubscription(userId);
  }
}
