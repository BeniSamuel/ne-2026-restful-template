import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireExtinguisher } from 'src/model/fire-extinguisher.model';
import { ExtinguisherController } from './extinguisher.controller';
import { ExtinguisherService } from './extinguisher.service';

@Module({
  imports: [TypeOrmModule.forFeature([FireExtinguisher])],
  controllers: [ExtinguisherController],
  providers: [ExtinguisherService],
})
export class ExtinguisherModule {}
