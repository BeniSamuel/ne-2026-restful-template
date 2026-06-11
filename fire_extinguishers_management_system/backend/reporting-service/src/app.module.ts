require('dotenv').config();
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReportingController } from './module/reporting.controller';
import { ReportingService } from './module/reporting.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXTINGUISHER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },
      {
        name: 'INSPECTION_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3004 },
      },
      {
        name: 'MAINTENANCE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3005 },
      },
    ]),
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class AppModule {}
