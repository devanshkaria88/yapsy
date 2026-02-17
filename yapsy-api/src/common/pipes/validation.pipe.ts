import { ValidationPipe } from '@nestjs/common';

export const AppValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});
