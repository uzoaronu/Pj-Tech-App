import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('PJ-Tech Books')
    .setDescription('The PJ-Tech Books App API description')
    .setVersion('1.0')
    .addTag("API's")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt', // This name is important and should match the security name used in decorators
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const loggerInstance = app.get(Logger);

  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const configS = app.get(ConfigService);
  await app.listen(configS.get('PORT'));
  // await app.listen(3010);
}
bootstrap();
