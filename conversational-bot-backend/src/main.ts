import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AirtableService } from './airtable/airtable.service'; // Import AirtableService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

  // Temporarily create sample contacts for Airtable verification
  const airtableService = app.get(AirtableService);
  await airtableService.createSampleContacts();
}
bootstrap();