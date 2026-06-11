import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InspectionService } from './inspection.service';

@Controller()
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @MessagePattern({ cmd: 'create-inspection' })
  create(@Payload() payload: any) {
    return this.inspectionService.create(payload);
  }

  @MessagePattern({ cmd: 'get-inspections' })
  findAll(@Payload() query: any) {
    return this.inspectionService.findAll(query);
  }

  @MessagePattern({ cmd: 'get-inspection-by-id' })
  findOne(@Payload() payload: { id: string }) {
    return this.inspectionService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update-inspection' })
  update(@Payload() payload: { id: string; data: any }) {
    return this.inspectionService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'delete-inspection' })
  remove(@Payload() payload: { id: string }) {
    return this.inspectionService.remove(payload.id);
  }
}
