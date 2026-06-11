import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.SERVICE_HOST ?? 'localhost',
        port: Number(process.env.SERVICE_PORT ?? 3004),
      },
    },
  );
  await app.listen();
  console.log('Inspection service running on port 3004');
}
bootstrap();
