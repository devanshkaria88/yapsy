import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformInterceptor],
    }).compile();

    interceptor =
      module.get<TransformInterceptor<unknown>>(TransformInterceptor);

    mockExecutionContext = {} as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should wrap plain data in success and data properties', async () => {
      const plainData = { id: 1, name: 'Test' };
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(plainData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: plainData,
      });
    });

    it('should pass through data that already has success property', async () => {
      const dataWithSuccess = {
        success: true,
        data: { id: 1 },
        meta: { page: 1 },
      };
      jest
        .spyOn(mockCallHandler, 'handle')
        .mockReturnValue(of(dataWithSuccess));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual(dataWithSuccess);
    });

    it('should extract meta and items from paginated responses', async () => {
      const paginatedData = {
        meta: {
          page: 1,
          limit: 10,
          total: 100,
        },
        items: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(paginatedData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: paginatedData.items,
        meta: paginatedData.meta,
      });
    });

    it('should handle string data', async () => {
      const stringData = 'test string';
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(stringData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: stringData,
      });
    });

    it('should handle number data', async () => {
      const numberData = 42;
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(numberData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: numberData,
      });
    });

    it('should handle array data', async () => {
      const arrayData = [1, 2, 3];
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(arrayData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: arrayData,
      });
    });

    it('should handle null data', async () => {
      const nullData = null;
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(nullData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({
        success: true,
        data: nullData,
      });
    });

    it('should not add meta when data does not have meta and items', async () => {
      const plainData = { id: 1 };
      jest.spyOn(mockCallHandler, 'handle').mockReturnValue(of(plainData));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).not.toHaveProperty('meta');
      expect(result).toEqual({
        success: true,
        data: plainData,
      });
    });
  });
});
