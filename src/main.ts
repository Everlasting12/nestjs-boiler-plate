import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Enable credentials (cookies)
  });
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('Classes')
    .setDescription('The Tuition classes API description')
    .setVersion('1.0')
    .addTag('classes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  // Starts listening for shutdown hooks
  //  app.enableShutdownHooks();

  await app.listen(parseInt(port));
}
bootstrap();
