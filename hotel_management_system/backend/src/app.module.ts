import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Hotel } from './entities/hotel.entity';
import { Report } from './entities/report.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'beni@ish',
      database: process.env.DB_DATABASE || 'practice',
      entities: [User, Hotel, Booking, Report],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    HotelsModule,
    BookingsModule,
    ReportsModule,
  ],
})
export class AppModule {}
