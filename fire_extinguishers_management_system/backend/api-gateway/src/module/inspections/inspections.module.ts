import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InspectionsController } from './inspections.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INSPECTION_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3004 },
      },
    ]),
  ],
  controllers: [InspectionsController],
})
export class InspectionsModule {}
