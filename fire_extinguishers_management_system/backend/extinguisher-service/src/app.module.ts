require('dotenv').config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtinguisherModule } from './module/extinguisher.module';
import { FireExtinguisher } from './model/fire-extinguisher.model';

const env = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST ?? 'localhost',
      port: Number(env.DB_PORT ?? 5432),
      username: env.DB_USERNAME ?? 'postgres',
      password: env.DB_PASSWORD ?? 'beni@ish',
      database: env.DB_NAME ?? 'fire_mns_extinguisher_service_db',
      entities: [FireExtinguisher],
      synchronize: true,
    }),
    ExtinguisherModule,
  ],
})
export class AppModule {}
