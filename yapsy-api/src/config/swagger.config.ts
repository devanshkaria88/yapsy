import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  // ─── Mobile API Swagger ───────────────────────────────────────────

  const mobileConfig = new DocumentBuilder()
    .setTitle('Yapsy Mobile API')
    .setDescription('API for the Yapsy Flutter mobile application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'mobile-jwt',
    )
    .build();

  const mobileDocument = SwaggerModule.createDocument(app, mobileConfig, {
    include: [],
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `mobile_${controllerKey}_${methodKey}`,
  });

  // Filter to only mobile + webhook routes
  const mobilePaths: Record<string, Record<string, unknown>> = {};
  for (const [path, methods] of Object.entries(mobileDocument.paths)) {
    if (path.includes('/mobile/') || path.includes('/webhooks/')) {
      mobilePaths[path] = methods as Record<string, unknown>;
    }
  }
  mobileDocument.paths = mobilePaths;

  SwaggerModule.setup('docs/mobile', app, mobileDocument, {
    jsonDocumentUrl: 'docs/mobile-json',
    yamlDocumentUrl: 'docs/mobile-yaml',
    swaggerOptions: { persistAuthorization: true },
  });

  // ─── Admin API Swagger ────────────────────────────────────────────

  const adminConfig = new DocumentBuilder()
    .setTitle('Yapsy Admin API')
    .setDescription('API for the Yapsy Admin Dashboard')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'admin-jwt',
    )
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [],
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `admin_${controllerKey}_${methodKey}`,
  });

  // Filter to only admin routes
  const adminPaths: Record<string, Record<string, unknown>> = {};
  for (const [path, methods] of Object.entries(adminDocument.paths)) {
    if (path.includes('/admin/')) {
      adminPaths[path] = methods as Record<string, unknown>;
    }
  }
  adminDocument.paths = adminPaths;

  SwaggerModule.setup('docs/admin', app, adminDocument, {
    jsonDocumentUrl: 'docs/admin-json',
    yamlDocumentUrl: 'docs/admin-yaml',
    swaggerOptions: { persistAuthorization: true },
  });
}
