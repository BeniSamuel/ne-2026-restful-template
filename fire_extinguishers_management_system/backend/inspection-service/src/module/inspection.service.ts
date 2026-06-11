import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inspection, InspectionStatus } from 'src/model/inspection.model';
import { ApiResponse } from 'src/utils/response.util';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class InspectionService implements OnModuleInit {
  constructor(
    @InjectRepository(Inspection)
    private readonly repository: Repository<Inspection>,
  ) {}

  async onModuleInit() {
    const count = await this.repository.count();
    if (count > 0) return;
    await this.repository.save({
      id: '55555555-5555-5555-5555-555555555555',
      extinguisherId: '44444444-4444-4444-4444-444444444444',
      inspectorId: '22222222-2222-2222-2222-222222222222',
      scheduledDate: new Date('2026-06-10T09:00:00'),
      inspectionStatus: 'SCHEDULED',
      notes: 'Initial seeded inspection for presentation.',
    } as any);
  }

  async create(payload: Partial<Inspection>) {
    const validationError = this.validateInspection(payload, true);
    if (validationError) {
      return ApiResponse.badRequest(validationError, null);
    }
    const saved = await this.repository.save(this.repository.create(payload));
    return ApiResponse.created('Inspection scheduled successfully', saved);
  }

  async findAll(query: any = {}) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const sortBy = this.allowedSort(query.sortBy, ['scheduledDate', 'createdAt', 'inspectionStatus']);
    const sortOrder = String(query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const dateRangeError = this.validateDateRange(query.dateFrom, query.dateTo);
    if (dateRangeError) return ApiResponse.badRequest(dateRangeError, null);

    const builder = this.repository.createQueryBuilder('inspection');
    if (query.inspectorId) builder.andWhere('inspection.inspectorId = :inspectorId', { inspectorId: query.inspectorId });
    if (query.extinguisherId) builder.andWhere('inspection.extinguisherId = :extinguisherId', { extinguisherId: query.extinguisherId });
    if (query.inspectionStatus) builder.andWhere('inspection.inspectionStatus = :inspectionStatus', { inspectionStatus: query.inspectionStatus });
    if (query.dateFrom) builder.andWhere('inspection.scheduledDate >= :dateFrom', { dateFrom: query.dateFrom });
    if (query.dateTo) builder.andWhere('inspection.scheduledDate <= :dateTo', { dateTo: query.dateTo });
    if (query.search) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('inspection.extinguisherId ILIKE :search', { search: `%${query.search}%` })
            .orWhere('inspection.inspectorId ILIKE :search', { search: `%${query.search}%` })
            .orWhere('inspection.notes ILIKE :search', { search: `%${query.search}%` })
            .orWhere('CAST(inspection.inspectionStatus AS TEXT) ILIKE :search', { search: `%${query.search}%` });
        }),
      );
    }

    const [items, total] = await builder
      .orderBy(`inspection.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return ApiResponse.ok('Inspections obtained successfully', { items, total, page, limit });
  }

  async findOne(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Inspection not found', null);
    return ApiResponse.ok('Inspection obtained successfully', item);
  }

  async update(id: string, data: Partial<Inspection>) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Inspection not found', null);
    const merged = { ...item, ...data };
    const validationError = this.validateInspection(merged, false);
    if (validationError) return ApiResponse.badRequest(validationError, null);
    Object.assign(item, data);
    return ApiResponse.ok('Inspection updated successfully', await this.repository.save(item));
  }

  async remove(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Inspection not found', false);
    await this.repository.delete(id);
    return ApiResponse.ok('Inspection deleted successfully', true);
  }

  private validateInspection(payload: Partial<Inspection>, requireFuture: boolean): string | null {
    if (!payload.extinguisherId?.trim()) return 'Extinguisher ID is required';
    if (!payload.inspectorId?.trim()) return 'Inspector ID is required';
    if (!Object.values(InspectionStatus).includes(payload.inspectionStatus as InspectionStatus)) return 'Invalid inspection status';
    const scheduledDate = this.parseDate(payload.scheduledDate);
    if (!scheduledDate) return 'Scheduled date must be a valid date';
    if (requireFuture && scheduledDate.getTime() < Date.now()) return 'Scheduled date cannot be in the past';
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
    return allowed.includes(sortBy ?? '') ? sortBy : 'scheduledDate';
  }
}
