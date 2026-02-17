import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response already has success property, pass through
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Extract meta if present
        let meta: Record<string, unknown> | undefined;
        let responseData = data;

        if (
          data &&
          typeof data === 'object' &&
          'meta' in data &&
          'items' in data
        ) {
          meta = data.meta;
          responseData = data.items;
        }

        return {
          success: true,
          data: responseData,
          ...(meta ? { meta } : {}),
        };
      }),
    );
  }
}
