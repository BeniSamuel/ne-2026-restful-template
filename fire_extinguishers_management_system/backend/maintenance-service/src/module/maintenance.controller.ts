import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MaintenanceService } from './maintenance.service';

@Controller()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @MessagePattern({ cmd: 'create-maintenance' })
  create(@Payload() payload: any) {
    return this.maintenanceService.create(payload);
  }

  @MessagePattern({ cmd: 'get-maintenance' })
  findAll(@Payload() query: any) {
    return this.maintenanceService.findAll(query);
  }

  @MessagePattern({ cmd: 'get-maintenance-by-id' })
  findOne(@Payload() payload: { id: string }) {
    return this.maintenanceService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update-maintenance' })
  update(@Payload() payload: { id: string; data: any }) {
    return this.maintenanceService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'delete-maintenance' })
  remove(@Payload() payload: { id: string }) {
    return this.maintenanceService.remove(payload.id);
  }
}
