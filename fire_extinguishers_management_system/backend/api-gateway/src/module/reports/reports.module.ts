import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORTING_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3006 },
      },
    ]),
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
