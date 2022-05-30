import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });

  // use validation pipe (DTO validation)
  app.useGlobalPipes(
    // use this to get validation error in details
    // DEV MODE
    new ValidationPipe({
      transform: true,
    }),

    // use this to override error message to UnprocessableEntityException
    // PRODUCTION MODE
    // new ValidationPipe({
    //   transform: true,
    //   disableErrorMessages: false,
    //   exceptionFactory: (errors: ValidationError[]) =>
    //     new UnprocessableEntityException(),
    // }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const APP_PORT = configService.get('app.port') || 3000;
  await app.listen(APP_PORT, () => {
    console.log(`application is running on port ${APP_PORT}`);
  });
}
bootstrap();
