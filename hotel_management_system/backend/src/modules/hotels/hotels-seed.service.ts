import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Injectable()
export class HotelsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(HotelsSeedService.name);

  constructor(private readonly hotelsService: HotelsService) {}

  async onApplicationBootstrap() {
    await this.hotelsService.seedDefaults();
    this.logger.log('Default hotels ready');
  }
}
