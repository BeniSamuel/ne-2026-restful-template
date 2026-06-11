import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maintenance } from 'src/model/maintenance.model';
import { ApiResponse } from 'src/utils/response.util';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class MaintenanceService implements OnModuleInit {
  constructor(
    @InjectRepository(Maintenance)
    private readonly repository: Repository<Maintenance>,
  ) {}

  async onModuleInit() {
    const count = await this.repository.count();
    if (count > 0) return;
    await this.repository.save({
      id: '66666666-6666-6666-6666-666666666666',
      extinguisherId: '44444444-4444-4444-4444-444444444444',
      inspectorId: '22222222-2222-2222-2222-222222222222',
      actionTaken: 'Pressure gauge checked and safety pin verified.',
      conditionNoted: 'Good operating condition.',
      actionDate: new Date('2026-06-01T10:30:00'),
    } as any);
  }

  async create(payload: Partial<Maintenance>) {
    const validationError = this.validateMaintenance(payload);
    if (validationError) return ApiResponse.badRequest(validationError, null);
    const saved = await this.repository.save(this.repository.create(payload));
    return ApiResponse.created('Maintenance record created successfully', saved);
  }

  async findAll(query: any = {}) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const sortBy = this.allowedSort(query.sortBy, ['actionDate', 'createdAt']);
    const sortOrder = String(query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const dateRangeError = this.validateDateRange(query.dateFrom, query.dateTo);
    if (dateRangeError) return ApiResponse.badRequest(dateRangeError, null);

    const builder = this.repository.createQueryBuilder('maintenance');
    if (query.inspectorId) builder.andWhere('maintenance.inspectorId = :inspectorId', { inspectorId: query.inspectorId });
    if (query.extinguisherId) builder.andWhere('maintenance.extinguisherId = :extinguisherId', { extinguisherId: query.extinguisherId });
    if (query.dateFrom) builder.andWhere('maintenance.actionDate >= :dateFrom', { dateFrom: query.dateFrom });
    if (query.dateTo) builder.andWhere('maintenance.actionDate <= :dateTo', { dateTo: query.dateTo });
    if (query.search) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('maintenance.extinguisherId ILIKE :search', { search: `%${query.search}%` })
            .orWhere('maintenance.inspectorId ILIKE :search', { search: `%${query.search}%` })
            .orWhere('maintenance.actionTaken ILIKE :search', { search: `%${query.search}%` })
            .orWhere('maintenance.conditionNoted ILIKE :search', { search: `%${query.search}%` });
        }),
      );
    }

    const [items, total] = await builder
      .orderBy(`maintenance.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return ApiResponse.ok('Maintenance records obtained successfully', { items, total, page, limit });
  }

  async findOne(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Maintenance record not found', null);
    return ApiResponse.ok('Maintenance record obtained successfully', item);
  }

  async update(id: string, data: Partial<Maintenance>) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Maintenance record not found', null);
    const merged = { ...item, ...data };
    const validationError = this.validateMaintenance(merged);
    if (validationError) return ApiResponse.badRequest(validationError, null);
    Object.assign(item, data);
    return ApiResponse.ok('Maintenance record updated successfully', await this.repository.save(item));
  }

  async remove(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Maintenance record not found', false);
    await this.repository.delete(id);
    return ApiResponse.ok('Maintenance record deleted successfully', true);
  }

  private validateMaintenance(payload: Partial<Maintenance>): string | null {
    if (!payload.extinguisherId?.trim()) return 'Extinguisher ID is required';
    if (!payload.inspectorId?.trim()) return 'Inspector ID is required';
    if (!payload.actionTaken?.trim()) return 'Action taken is required';
    if (!payload.conditionNoted?.trim()) return 'Condition noted is required';
    const actionDate = this.parseDate(payload.actionDate);
    if (!actionDate) return 'Action date must be a valid date';
    if (actionDate.getTime() > Date.now()) return 'Action date cannot be in the future';
    return null;
  }

  private validateDateRange(from?: string, to?: string): string | null {
    const fromDate = from ? this.parseDate(from) : null;
    const toDate = to ? this.parseDate(to) : null;
    if (from && !fromDate) return 'dateFrom must be a valid date';
    if (to && !toDate) return 'dateTo must be a valid date';
    if (fromDate && toDate && toDate < fromDate) return 'dateTo cannot be before dateFrom';
    return null;
  }

  private parseDate(value?: string | Date): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private allowedSort(sortBy: string | undefined, allowed: string[]): string {
    return allowed.includes(sortBy ?? '') ? sortBy : 'actionDate';
  }
}
