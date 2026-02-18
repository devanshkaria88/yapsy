import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { HttpExceptionFilter, INTERNAL_ERROR } from './http-exception.filter';
import { Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('catch', () => {
    it('should catch HttpException and return error response with code and message', () => {
      const exception = new HttpException(
        {
          code: 'CUSTOM_ERROR',
          message: 'Custom error message',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CUSTOM_ERROR',
          message: 'Custom error message',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });

    it('should handle BadRequestException with array messages by joining them', () => {
      const exception = new BadRequestException({
        message: ['Error 1', 'Error 2', 'Error 3'],
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Error 1, Error 2, Error 3',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });

    it('should handle BadRequestException with string message', () => {
      const exception = new BadRequestException({
        message: 'Validation failed',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Validation failed',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Simple error message', 400);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Simple error message',
          statusCode: 400,
        },
      });
    });

    it('should handle HttpException with error property as string', () => {
      const exception = new HttpException(
        {
          error: 'Error description',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Error description',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });

    it('should map status codes to default codes for BAD_REQUEST', () => {
      const exception = new BadRequestException('Bad request');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Bad request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });

    it('should map status codes to default codes for UNAUTHORIZED', () => {
      const exception = new UnauthorizedException('Unauthorized');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    });

    it('should map status codes to default codes for FORBIDDEN', () => {
      const exception = new ForbiddenException('Forbidden');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Forbidden',
          statusCode: HttpStatus.FORBIDDEN,
        },
      });
    });

    it('should map status codes to default codes for NOT_FOUND', () => {
      const exception = new NotFoundException('Not found');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });

    it('should map status codes to default codes for CONFLICT', () => {
      const exception = new ConflictException('Conflict');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
        },
      });
    });

    it('should handle generic errors (non-HttpException) returning 500 with INTERNAL_ERROR code', () => {
      const genericError = new Error('Generic error');
      const loggerErrorSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(genericError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: INTERNAL_ERROR,
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
      expect(loggerErrorSpy).toHaveBeenCalledWith(genericError);
    });

    it('should handle unknown error types', () => {
      const unknownError = 'String error';

      filter.catch(unknownError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: INTERNAL_ERROR,
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    });

    it('should use exception message when response object has no message or error', () => {
      const exception = new HttpException(
        {
          someOtherField: 'value',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: exception.message,
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    });
  });
});
