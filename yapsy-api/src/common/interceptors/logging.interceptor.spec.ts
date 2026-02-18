import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';
import { Request, Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    const mockRequest = {
      method: 'GET',
      url: '/api/test',
    } as Request;

    const mockResponse = {
      statusCode: 200,
    } as Response;

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    } as unknown as CallHandler;

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  describe('intercept', () => {
    it('should call console.log with method, url, statusCode, and responseTime', async () => {
      await new Promise<void>((resolve) => {
        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          complete: () => {
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
            const logCall = consoleLogSpy.mock.calls[0][0];
            expect(logCall).toMatch(/^GET \/api\/test \d+ - \d+ms$/);
            resolve();
          },
        });
      });
    });

    it('should log POST request correctly', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/users',
      } as Request;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest
            .fn()
            .mockReturnValue({ statusCode: 201 } as Response),
        }),
      } as unknown as ExecutionContext;

      await new Promise<void>((resolve) => {
        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          complete: () => {
            const logCall = consoleLogSpy.mock.calls[0][0];
            expect(logCall).toMatch(/^POST \/api\/users \d+ - \d+ms$/);
            resolve();
          },
        });
      });
    });

    it('should log error status codes correctly', async () => {
      const mockResponse = {
        statusCode: 404,
      } as Response;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            url: '/api/not-found',
          } as Request),
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
      } as unknown as ExecutionContext;

      await new Promise<void>((resolve) => {
        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          complete: () => {
            const logCall = consoleLogSpy.mock.calls[0][0];
            expect(logCall).toMatch(/^GET \/api\/not-found 404 - \d+ms$/);
            resolve();
          },
        });
      });
    });

    it('should calculate response time correctly', async () => {
      await new Promise<void>((resolve) => {
        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          complete: () => {
            const logCall = consoleLogSpy.mock.calls[0][0];
            const match = logCall.match(/- (\d+)ms$/);
            expect(match).toBeTruthy();
            if (match) {
              const responseTime = parseInt(match[1], 10);
              expect(responseTime).toBeGreaterThanOrEqual(0);
            }
            resolve();
          },
        });
      });
    });
  });
});
