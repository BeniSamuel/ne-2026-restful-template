require('dotenv').config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './model/user.model';
import { UserModule } from './module/user.module';

const env = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST ?? 'localhost',
      port: Number(env.DB_PORT ?? 5432),
      username: env.DB_USERNAME ?? 'postgres',
      password: env.DB_PASSWORD ?? 'beni@ish',
      database: env.DB_NAME ?? 'fire_mns_user_service_db',
      entities: [Users],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
