import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function MobileApi(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth('mobile-jwt'));
}

export function AdminApi(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth('admin-jwt'));
}
