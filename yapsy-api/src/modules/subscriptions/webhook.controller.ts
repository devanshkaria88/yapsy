import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/v1/webhooks')
@ApiTags('Webhooks')
export class WebhookController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('razorpay')
  @ApiExcludeEndpoint()
  async processRazorpayWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException(
        'Raw body not available - ensure raw body is configured for webhook route',
      );
    }

    if (!signature) {
      throw new BadRequestException('Missing x-razorpay-signature header');
    }

    const rawBodyString =
      typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    await this.subscriptionsService.processWebhook(
      payload,
      signature,
      rawBodyString,
    );

    return { received: true };
  }
}
