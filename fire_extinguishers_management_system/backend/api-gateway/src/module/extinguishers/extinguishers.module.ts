import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExtinguishersController } from './extinguishers.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXTINGUISHER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },
    ]),
  ],
  controllers: [ExtinguishersController],
})
export class ExtinguishersModule {}
