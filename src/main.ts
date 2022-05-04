import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
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

  const options = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const usersDocument = SwaggerModule.createDocument(app, options, {
    include: [UsersModule],
  });
  SwaggerModule.setup('api/users', app, usersDocument);

  await app.listen(3000);
}
bootstrap();
