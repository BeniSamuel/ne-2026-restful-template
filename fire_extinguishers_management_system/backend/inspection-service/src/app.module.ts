require('dotenv').config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from './model/inspection.model';
import { InspectionModule } from './module/inspection.module';

const env = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST ?? 'localhost',
      port: Number(env.DB_PORT ?? 5432),
      username: env.DB_USERNAME ?? 'postgres',
      password: env.DB_PASSWORD ?? 'beni@ish',
      database: env.DB_NAME ?? 'fire_mns_inspection_service_db',
      entities: [Inspection],
      synchronize: true,
    }),
    InspectionModule,
  ],
})
export class AppModule {}
