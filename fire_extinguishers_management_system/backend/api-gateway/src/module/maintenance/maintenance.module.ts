import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAINTENANCE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3005 },
      },
    ]),
  ],
  controllers: [MaintenanceController],
})
export class MaintenanceModule {}
