import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { generateDocs } from './swagger/swagger';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({ origin: '*' }); //desability in production

  generateDocs(
    new DocumentBuilder()
      .setTitle('User')
      .setDescription('The users API description')
      .setVersion('1.0')
      .build(),
    'users',
    app,
    UsersModule,
  );

  await app.listen(3000);
}
bootstrap();
