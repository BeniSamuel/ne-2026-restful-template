import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExtinguisherService } from './extinguisher.service';

@Controller()
export class ExtinguisherController {
  constructor(private readonly extinguisherService: ExtinguisherService) {}

  @MessagePattern({ cmd: 'create-extinguisher' })
  create(@Payload() payload: any) {
    return this.extinguisherService.create(payload);
  }

  @MessagePattern({ cmd: 'get-extinguishers' })
  findAll(@Payload() query: any) {
    return this.extinguisherService.findAll(query);
  }

  @MessagePattern({ cmd: 'get-extinguisher-by-id' })
  findOne(@Payload() payload: { id: string }) {
    return this.extinguisherService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update-extinguisher' })
  update(@Payload() payload: { id: string; data: any }) {
    return this.extinguisherService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'delete-extinguisher' })
  remove(@Payload() payload: { id: string }) {
    return this.extinguisherService.remove(payload.id);
  }
}
