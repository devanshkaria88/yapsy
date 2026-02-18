import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export const INTERNAL_ERROR = 'INTERNAL_ERROR';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let code: string;
    let message: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;

        // Handle validation errors (BadRequestException with array message)
        if (
          statusCode === (HttpStatus.BAD_REQUEST as number) &&
          Array.isArray(res.message)
        ) {
          message = res.message.join(', ');
        } else if (typeof res.message === 'string') {
          message = res.message;
        } else if (typeof res.error === 'string') {
          message = res.error;
        } else {
          message = exception.message;
        }

        code = (res.code as string) || this.getDefaultCode(statusCode);
      } else {
        message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exception.message;
        code = this.getDefaultCode(statusCode);
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = INTERNAL_ERROR;
      message = 'Internal server error';
      this.logger.error(exception);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        statusCode,
      },
    };

    response.status(statusCode).json(errorResponse);
  }

  private getDefaultCode(statusCode: number): string {
    const codes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
    };
    return codes[statusCode] || 'ERROR';
  }
}
