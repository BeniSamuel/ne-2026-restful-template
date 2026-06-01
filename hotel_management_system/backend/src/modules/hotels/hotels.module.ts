import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelsController } from './hotels.controller';
import { HotelsSeedService } from './hotels-seed.service';
import { HotelsService } from './hotels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelsController],
  providers: [HotelsService, HotelsSeedService],
  exports: [HotelsService],
})
export class HotelsModule {}
