import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1';

export interface RazorpaySubscriptionResponse {
  id: string;
  plan_id: string;
  status: string;
  short_url?: string;
  customer_id?: string;
  [key: string]: unknown;
}

export interface RazorpayCustomerResponse {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

@Injectable()
export class RazorpayService {
  constructor(private readonly configService: ConfigService) {}

  private getAuthHeader(): string {
    const keyId = this.configService.get<string>('razorpay.keyId');
    const keySecret = this.configService.get<string>('razorpay.keySecret');
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createSubscription(
    planId: string,
    customerId?: string,
    totalCount: number = 12,
  ): Promise<RazorpaySubscriptionResponse> {
    const body: Record<string, unknown> = {
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
      customer_notify: true,
    };

    if (customerId) {
      body.customer_id = customerId;
    }

    const response = await fetch(`${RAZORPAY_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  verifyPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string,
  ): boolean {
    const keySecret =
      this.configService.get<string>('razorpay.keySecret') ?? '';
    const body = `${paymentId}|${subscriptionId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  }

  verifyWebhookSignature(body: string, signature: string): boolean {
    const webhookSecret =
      this.configService.get<string>('razorpay.webhookSecret') ?? '';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch(
      `${RAZORPAY_BASE_URL}/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({ cancel_at_cycle_end: false }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay cancel error: ${response.status} - ${error}`);
    }
  }

  async getSubscription(
    subscriptionId: string,
  ): Promise<RazorpaySubscriptionResponse> {
    const response = await fetch(
      `${RAZORPAY_BASE_URL}/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: this.getAuthHeader(),
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createCustomer(
    email: string,
    name: string,
    contact?: string,
  ): Promise<RazorpayCustomerResponse> {
    const body: Record<string, unknown> = {
      email,
      name,
      fail_existing: '0',
    };

    if (contact) {
      body.contact = contact;
    }

    const response = await fetch(`${RAZORPAY_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay customer create error: ${response.status} - ${error}`);
    }

    return response.json();
  }
}
