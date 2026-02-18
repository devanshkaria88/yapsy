import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AdminRole } from '../enums';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { AdminUser } from '../../modules/users/entities/admin-user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user as AdminUser | undefined;

    if (!user || user.role !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Super admin access required');
    }

    return true;
  }
}
