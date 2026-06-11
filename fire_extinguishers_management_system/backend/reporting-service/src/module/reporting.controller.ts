import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportingService } from './reporting.service';

@Controller()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @MessagePattern({ cmd: 'report-extinguishers' })
  extinguishers(@Payload() query: any) {
    return this.reportingService.extinguishers(query);
  }

  @MessagePattern({ cmd: 'report-inspection-status' })
  inspectionStatus() {
    return this.reportingService.inspectionStatus();
  }

  @MessagePattern({ cmd: 'report-expired' })
  expired() {
    return this.reportingService.expired();
  }

  @MessagePattern({ cmd: 'report-maintenance-history' })
  maintenanceHistory() {
    return this.reportingService.maintenanceHistory();
  }
}
