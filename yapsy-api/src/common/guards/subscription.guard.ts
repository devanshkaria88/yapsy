import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRES_PRO_KEY } from '../decorators/requires-pro.decorator';

export const SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresPro = this.reflector.getAllAndOverride<boolean>(
      REQUIRES_PRO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresPro) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.subscription_status !== 'pro') {
      throw new ForbiddenException({
        code: SUBSCRIPTION_REQUIRED,
        message: 'Pro subscription required',
      });
    }

    return true;
  }
}
