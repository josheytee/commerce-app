import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from './config/winston-logger.config';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins (development only)
    // OR specify allowed origins:
    // origin: ['http://localhost:3000', 'https://yourdomain.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies and authorization headers
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: 'Content-Range, X-Content-Range',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Set the global prefix
  app.setGlobalPrefix('api');

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // Versioning via URI (/v1, /v2, etc.)
  });

  // Ignore HMR and SSE routes
  app.use((req, res, next) => {
    if (req.url.includes('__webpack_hmr') || req.url.includes('_loading/sse')) {
      return res.status(204).send();
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Ojalanta API')
    .setDescription('Multi-vendor marketplace API')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 for JWT
    // .addServer('http://localhost:3000')
    // .addServer('https://commerce-app-mv98.onrender.com') // change later
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps token after refresh
    },
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
