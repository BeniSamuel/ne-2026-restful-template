import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExtinguisherSize,
  ExtinguisherStatus,
  ExtinguisherType,
  FireExtinguisher,
} from 'src/model/fire-extinguisher.model';
import { ApiResponse } from 'src/utils/response.util';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ExtinguisherService implements OnModuleInit {
  constructor(
    @InjectRepository(FireExtinguisher)
    private readonly repository: Repository<FireExtinguisher>,
  ) {}

  async onModuleInit() {
    const count = await this.repository.count();
    if (count > 0) return;
    await this.repository.save({
      id: '44444444-4444-4444-4444-444444444444',
      serialNumber: 'TZW-FE-001',
      location: 'Main Office - Reception',
      type: 'DRY_CHEMICAL',
      size: '5_LBS',
      installationDate: '2025-01-15',
      expiryDate: '2027-01-15',
      status: 'ACTIVE',
    } as any);
  }

  async create(payload: Partial<FireExtinguisher>) {
    const validationError = this.validateExtinguisher(payload);
    if (validationError) {
      return ApiResponse.badRequest(validationError, null);
    }

    const existing = await this.repository.findOne({
      where: { serialNumber: payload.serialNumber },
    });
    if (existing) {
      return ApiResponse.badRequest('Serial number already exists', null);
    }
    const saved = await this.repository.save(this.repository.create(payload));
    return ApiResponse.created('Extinguisher created successfully', saved);
  }

  async findAll(query: any = {}) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
    const sortBy = this.allowedSort(query.sortBy, [
      'serialNumber',
      'location',
      'type',
      'size',
      'installationDate',
      'expiryDate',
      'status',
      'createdAt',
      'updatedAt',
    ]);
    const sortOrder = String(query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const dateRangeError = this.validateDateRange(query.expiryFrom, query.expiryTo);
    if (dateRangeError) {
      return ApiResponse.badRequest(dateRangeError, null);
    }

    const builder = this.repository.createQueryBuilder('extinguisher');

    if (query.status) builder.andWhere('extinguisher.status = :status', { status: query.status });
    if (query.type) builder.andWhere('extinguisher.type = :type', { type: query.type });
    if (query.size) builder.andWhere('extinguisher.size = :size', { size: query.size });
    if (query.expiryFrom) builder.andWhere('extinguisher.expiryDate >= :expiryFrom', { expiryFrom: query.expiryFrom });
    if (query.expiryTo) builder.andWhere('extinguisher.expiryDate <= :expiryTo', { expiryTo: query.expiryTo });
    if (query.search) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('extinguisher.serialNumber ILIKE :search', { search: `%${query.search}%` })
            .orWhere('extinguisher.location ILIKE :search', { search: `%${query.search}%` })
            .orWhere('CAST(extinguisher.type AS TEXT) ILIKE :search', { search: `%${query.search}%` })
            .orWhere('CAST(extinguisher.status AS TEXT) ILIKE :search', { search: `%${query.search}%` });
        }),
      );
    }

    const [items, total] = await builder
      .orderBy(`extinguisher.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return ApiResponse.ok('Extinguishers obtained successfully', {
      items,
      total,
      page,
      limit,
    });
  }

  async findOne(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Extinguisher not found', null);
    return ApiResponse.ok('Extinguisher obtained successfully', item);
  }

  async update(id: string, data: Partial<FireExtinguisher>) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Extinguisher not found', null);
    const merged = { ...item, ...data };
    const validationError = this.validateExtinguisher(merged);
    if (validationError) {
      return ApiResponse.badRequest(validationError, null);
    }
    Object.assign(item, data);
    return ApiResponse.ok(
      'Extinguisher updated successfully',
      await this.repository.save(item),
    );
  }

  async remove(id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) return ApiResponse.notFound('Extinguisher not found', false);
    await this.repository.delete(id);
    return ApiResponse.ok('Extinguisher deleted successfully', true);
  }

  private validateExtinguisher(payload: Partial<FireExtinguisher>): string | null {
    if (!payload.serialNumber?.trim()) return 'Serial number is required';
    if (!payload.location?.trim()) return 'Location is required';
    if (!Object.values(ExtinguisherType).includes(payload.type as ExtinguisherType)) return 'Invalid extinguisher type';
    if (!Object.values(ExtinguisherSize).includes(payload.size as ExtinguisherSize)) return 'Invalid extinguisher size';
    if (!Object.values(ExtinguisherStatus).includes(payload.status as ExtinguisherStatus)) return 'Invalid extinguisher status';

    const installationDate = this.parseDate(payload.installationDate);
    const expiryDate = this.parseDate(payload.expiryDate);
    if (!installationDate) return 'Installation date must be a valid date';
    if (!expiryDate) return 'Expiry date must be a valid date';
    if (expiryDate < installationDate) return 'Expiry date cannot be before installation date';
    return null;
  }

  private validateDateRange(from?: string, to?: string): string | null {
    const fromDate = from ? this.parseDate(from) : null;
    const toDate = to ? this.parseDate(to) : null;
    if (from && !fromDate) return 'expiryFrom must be a valid date';
    if (to && !toDate) return 'expiryTo must be a valid date';
    if (fromDate && toDate && toDate < fromDate) return 'expiryTo cannot be before expiryFrom';
    return null;
  }

  private parseDate(value?: string | Date): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private allowedSort(sortBy: string | undefined, allowed: string[]): string {
    return allowed.includes(sortBy ?? '') ? sortBy : 'createdAt';
  }
}
