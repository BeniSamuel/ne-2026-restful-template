import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(
    @Inject('REPORTING_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get('extinguishers')
  extinguishers(@Query() query: any) {
    return firstValueFrom(this.client.send({ cmd: 'report-extinguishers' }, query));
  }

  @Get('inspection-status')
  inspectionStatus() {
    return firstValueFrom(this.client.send({ cmd: 'report-inspection-status' }, {}));
  }

  @Get('expired')
  expired() {
    return firstValueFrom(this.client.send({ cmd: 'report-expired' }, {}));
  }

  @Get('maintenance-history')
  maintenanceHistory() {
    return firstValueFrom(this.client.send({ cmd: 'report-maintenance-history' }, {}));
  }
}
