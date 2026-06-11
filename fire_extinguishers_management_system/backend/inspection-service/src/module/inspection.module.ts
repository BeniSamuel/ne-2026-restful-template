import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from 'src/model/inspection.model';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inspection])],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}
