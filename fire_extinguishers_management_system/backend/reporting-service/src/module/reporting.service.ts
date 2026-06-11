import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportingService {
  constructor(
    @Inject('EXTINGUISHER_SERVICE') private readonly extinguisherClient: ClientProxy,
    @Inject('INSPECTION_SERVICE') private readonly inspectionClient: ClientProxy,
    @Inject('MAINTENANCE_SERVICE') private readonly maintenanceClient: ClientProxy,
  ) {}

  async extinguishers(query: any = {}) {
    const response = await firstValueFrom(
      this.extinguisherClient.send(
        { cmd: 'get-extinguishers' },
        { ...query, limit: 100 },
      ),
    );
    const items = response.data?.items ?? [];
    const byStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      success: true,
      message: 'Extinguisher report generated successfully',
      data: { total: response.data?.total ?? items.length, byStatus, items },
      status: 200,
    };
  }

  async inspectionStatus() {
    const response = await firstValueFrom(
      this.inspectionClient.send({ cmd: 'get-inspections' }, {}),
    );
    const items = response.data?.items ?? response.data ?? [];
    const byStatus = items.reduce((acc, item) => {
      acc[item.inspectionStatus] = (acc[item.inspectionStatus] ?? 0) + 1;
      return acc;
    }, {});
    return {
      success: true,
      message: 'Inspection status report generated successfully',
      data: { total: items.length, byStatus, items },
      status: 200,
    };
  }

  async expired() {
    const response = await firstValueFrom(
      this.extinguisherClient.send({ cmd: 'get-extinguishers' }, { limit: 100 }),
    );
    const today = new Date();
    const items = (response.data?.items ?? []).filter(
      (item) => new Date(item.expiryDate) < today || item.status === 'EXPIRED',
    );
    return {
      success: true,
      message: 'Expired extinguisher report generated successfully',
      data: { total: items.length, items },
      status: 200,
    };
  }

  async maintenanceHistory() {
    const response = await firstValueFrom(
      this.maintenanceClient.send({ cmd: 'get-maintenance' }, {}),
    );
    const items = response.data?.items ?? response.data ?? [];
    return {
      success: true,
      message: 'Maintenance history report generated successfully',
      data: { total: items.length, items },
      status: 200,
    };
  }
}
