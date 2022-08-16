import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
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
      .setTitle('Authenticate')
      .setDescription('The users token provider')
      .setVersion('1.0')
      .build(),
    'login',
    app,
    [AuthModule],
  );

  generateDocs(
    new DocumentBuilder()
      .setTitle('User')
      .setDescription('The users API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    'users',
    app,
    [UsersModule],
  );

  generateDocs(
    new DocumentBuilder()
      .setTitle('Providers')
      .setDescription('The providers API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    'providers',
    app,
    [ProvidersModule],
  );

  generateDocs(
    new DocumentBuilder()
      .setTitle('Appointments')
      .setDescription('The appointments API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    'appointments',
    app,
    [AppointmentsModule],
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
