import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PromoCodesService } from './promo-codes.service';
import { PromoCode } from './entities/promo-code.entity';
import { UserPromoRedemption } from './entities/user-promo-redemption.entity';
import { PromoType } from '../../common/enums';
import { CreatePromoDto } from './dto';

describe('PromoCodesService', () => {
  let service: PromoCodesService;
  let promoRepo: jest.Mocked<Repository<PromoCode>>;
  let _redemptionRepo: jest.Mocked<Repository<UserPromoRedemption>>;
  let _dataSource: jest.Mocked<DataSource>;

  const mockPromo: PromoCode = {
    id: 'promo-1',
    code: 'TEST20',
    type: PromoType.PERCENTAGE,
    value: 20,
    is_active: true,
    current_uses: 0,
    max_uses: 100,
    valid_from: new Date('2026-01-01'),
    valid_until: new Date('2026-12-31'),
  } as PromoCode;

  beforeEach(async () => {
    const mockPromoRepo = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const mockRedemptionRepo = {
      findOne: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoCodesService,
        {
          provide: getRepositoryToken(PromoCode),
          useValue: mockPromoRepo,
        },
        {
          provide: getRepositoryToken(UserPromoRedemption),
          useValue: mockRedemptionRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<PromoCodesService>(PromoCodesService);
    promoRepo = module.get(getRepositoryToken(PromoCode));
    _redemptionRepo = module.get(getRepositoryToken(UserPromoRedemption));
    _dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateDiscount', () => {
    it('should calculate PERCENTAGE discount correctly', () => {
      const promo = {
        ...mockPromo,
        type: PromoType.PERCENTAGE,
        value: 20,
      };

      const result = service.calculateDiscount(promo, 1000);

      expect(result).toBe(200);
    });

    it('should calculate FLAT discount correctly', () => {
      const promo = {
        ...mockPromo,
        type: PromoType.FLAT,
        value: 50,
      };

      const result = service.calculateDiscount(promo, 1000);

      expect(result).toBe(50);
    });

    it('should calculate SET_PRICE discount correctly', () => {
      const promo = {
        ...mockPromo,
        type: PromoType.SET_PRICE,
        value: 800,
      };

      const result = service.calculateDiscount(promo, 1000);

      expect(result).toBe(200);
    });

    it('should return 0 discount when SET_PRICE value exceeds price', () => {
      const promo = {
        ...mockPromo,
        type: PromoType.SET_PRICE,
        value: 1200,
      };

      const result = service.calculateDiscount(promo, 1000);

      expect(result).toBe(0);
    });
  });

  describe('validate', () => {
    it('should throw 404 when promo not found', async () => {
      promoRepo.findOne.mockResolvedValue(null);

      await expect(service.validate('INVALID')).rejects.toThrow(HttpException);

      try {
        await service.validate('INVALID');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.response.code).toBe('PROMO_NOT_FOUND');
      }
    });

    it('should throw 400 when promo is not active', async () => {
      const inactivePromo = { ...mockPromo, is_active: false };
      promoRepo.findOne.mockResolvedValue(inactivePromo);

      await expect(service.validate('TEST20')).rejects.toThrow(HttpException);

      try {
        await service.validate('TEST20');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response.code).toBe('PROMO_NOT_ACTIVE');
      }
    });

    it('should throw 400 when promo is expired', async () => {
      const expiredPromo = {
        ...mockPromo,
        valid_until: new Date('2025-01-01'),
      };
      promoRepo.findOne.mockResolvedValue(expiredPromo);

      await expect(service.validate('TEST20')).rejects.toThrow(HttpException);

      try {
        await service.validate('TEST20');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response.code).toBe('PROMO_EXPIRED');
      }
    });

    it('should throw 400 when max uses reached', async () => {
      const maxedPromo = {
        ...mockPromo,
        current_uses: 100,
        max_uses: 100,
      };
      promoRepo.findOne.mockResolvedValue(maxedPromo);

      await expect(service.validate('TEST20')).rejects.toThrow(HttpException);

      try {
        await service.validate('TEST20');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response.code).toBe('PROMO_MAX_USES_REACHED');
      }
    });

    it('should return validation result when promo is valid', async () => {
      promoRepo.findOne.mockResolvedValue(mockPromo);

      const result = await service.validate('TEST20', 1000);

      expect(result.promo).toEqual(mockPromo);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(800);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockPromos = [mockPromo];
      promoRepo.findAndCount.mockResolvedValue([mockPromos, 1]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.items).toEqual(mockPromos);
      expect(result.meta.total).toBe(1);
      expect(promoRepo.findAndCount).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('create', () => {
    it('should create promo code', async () => {
      const dto: CreatePromoDto = {
        code: 'NEWCODE',
        type: PromoType.PERCENTAGE,
        value: 15,
        valid_from: '2026-01-01',
      };

      promoRepo.findOne.mockResolvedValue(null);
      promoRepo.create.mockReturnValue(mockPromo);
      promoRepo.save.mockResolvedValue(mockPromo);

      const result = await service.create(dto);

      expect(promoRepo.findOne).toHaveBeenCalledWith({
        where: { code: 'NEWCODE' },
      });
      expect(result).toEqual(mockPromo);
    });

    it('should throw BadRequestException when code already exists', async () => {
      const dto: CreatePromoDto = {
        code: 'EXISTING',
        type: PromoType.PERCENTAGE,
        value: 15,
        valid_from: '2026-01-01',
      };

      promoRepo.findOne.mockResolvedValue(mockPromo);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);

      try {
        await service.create(dto);
      } catch (error) {
        expect(error.response.code).toBe('PROMO_CODE_EXISTS');
      }
    });
  });

  describe('deactivate', () => {
    it('should update is_active to false', async () => {
      promoRepo.update.mockResolvedValue({ affected: 1 } as any);

      await service.deactivate('promo-1');

      expect(promoRepo.update).toHaveBeenCalledWith('promo-1', {
        is_active: false,
      });
    });

    it('should throw NotFoundException when promo not found', async () => {
      promoRepo.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.deactivate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
