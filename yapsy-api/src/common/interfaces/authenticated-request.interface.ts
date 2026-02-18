import { Request } from 'express';
import { User } from '../../modules/users/entities/user.entity';
import { AdminUser } from '../../modules/users/entities/admin-user.entity';

export interface AuthenticatedRequest extends Request {
  user: User | AdminUser;
}
