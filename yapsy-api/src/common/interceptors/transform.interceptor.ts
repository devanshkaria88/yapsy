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

interface PaginatedData {
  meta: Record<string, unknown>;
  items: unknown;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T): ApiResponse<T> => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data as unknown as ApiResponse<T>;
        }

        let meta: Record<string, unknown> | undefined;
        let responseData: T = data;

        if (
          data &&
          typeof data === 'object' &&
          'meta' in data &&
          'items' in data
        ) {
          const paginated = data as unknown as PaginatedData;
          meta = paginated.meta;
          responseData = paginated.items as T;
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
