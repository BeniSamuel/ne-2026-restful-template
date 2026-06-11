"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inspection_model_1 = require("../model/inspection.model");
const response_util_1 = require("../utils/response.util");
const typeorm_2 = require("typeorm");
let InspectionService = class InspectionService {
    constructor(repository) {
        this.repository = repository;
    }
    async onModuleInit() {
        const count = await this.repository.count();
        if (count > 0)
            return;
        await this.repository.save({
            id: '55555555-5555-5555-5555-555555555555',
            extinguisherId: '44444444-4444-4444-4444-444444444444',
            inspectorId: '22222222-2222-2222-2222-222222222222',
            scheduledDate: new Date('2026-06-10T09:00:00'),
            inspectionStatus: 'SCHEDULED',
            notes: 'Initial seeded inspection for presentation.',
        });
    }
    async create(payload) {
        const validationError = this.validateInspection(payload, true);
        if (validationError) {
            return response_util_1.ApiResponse.badRequest(validationError, null);
        }
        const saved = await this.repository.save(this.repository.create(payload));
        return response_util_1.ApiResponse.created('Inspection scheduled successfully', saved);
    }
    async findAll(query = {}) {
        const page = Math.max(Number(query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
        const sortBy = this.allowedSort(query.sortBy, ['scheduledDate', 'createdAt', 'inspectionStatus']);
        const sortOrder = String(query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const dateRangeError = this.validateDateRange(query.dateFrom, query.dateTo);
        if (dateRangeError)
            return response_util_1.ApiResponse.badRequest(dateRangeError, null);
        const builder = this.repository.createQueryBuilder('inspection');
        if (query.inspectorId)
            builder.andWhere('inspection.inspectorId = :inspectorId', { inspectorId: query.inspectorId });
        if (query.extinguisherId)
            builder.andWhere('inspection.extinguisherId = :extinguisherId', { extinguisherId: query.extinguisherId });
        if (query.inspectionStatus)
            builder.andWhere('inspection.inspectionStatus = :inspectionStatus', { inspectionStatus: query.inspectionStatus });
        if (query.dateFrom)
            builder.andWhere('inspection.scheduledDate >= :dateFrom', { dateFrom: query.dateFrom });
        if (query.dateTo)
            builder.andWhere('inspection.scheduledDate <= :dateTo', { dateTo: query.dateTo });
        if (query.search) {
            builder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('inspection.extinguisherId ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('inspection.inspectorId ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('inspection.notes ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('CAST(inspection.inspectionStatus AS TEXT) ILIKE :search', { search: `%${query.search}%` });
            }));
        }
        const [items, total] = await builder
            .orderBy(`inspection.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return response_util_1.ApiResponse.ok('Inspections obtained successfully', { items, total, page, limit });
    }
    async findOne(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Inspection not found', null);
        return response_util_1.ApiResponse.ok('Inspection obtained successfully', item);
    }
    async update(id, data) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Inspection not found', null);
        const merged = { ...item, ...data };
        const validationError = this.validateInspection(merged, false);
        if (validationError)
            return response_util_1.ApiResponse.badRequest(validationError, null);
        Object.assign(item, data);
        return response_util_1.ApiResponse.ok('Inspection updated successfully', await this.repository.save(item));
    }
    async remove(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Inspection not found', false);
        await this.repository.delete(id);
        return response_util_1.ApiResponse.ok('Inspection deleted successfully', true);
    }
    validateInspection(payload, requireFuture) {
        if (!payload.extinguisherId?.trim())
            return 'Extinguisher ID is required';
        if (!payload.inspectorId?.trim())
            return 'Inspector ID is required';
        if (!Object.values(inspection_model_1.InspectionStatus).includes(payload.inspectionStatus))
            return 'Invalid inspection status';
        const scheduledDate = this.parseDate(payload.scheduledDate);
        if (!scheduledDate)
            return 'Scheduled date must be a valid date';
        if (requireFuture && scheduledDate.getTime() < Date.now())
            return 'Scheduled date cannot be in the past';
        return null;
    }
    validateDateRange(from, to) {
        const fromDate = from ? this.parseDate(from) : null;
        const toDate = to ? this.parseDate(to) : null;
        if (from && !fromDate)
            return 'dateFrom must be a valid date';
        if (to && !toDate)
            return 'dateTo must be a valid date';
        if (fromDate && toDate && toDate < fromDate)
            return 'dateTo cannot be before dateFrom';
        return null;
    }
    parseDate(value) {
        if (!value)
            return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    allowedSort(sortBy, allowed) {
        return allowed.includes(sortBy ?? '') ? sortBy : 'scheduledDate';
    }
};
exports.InspectionService = InspectionService;
exports.InspectionService = InspectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inspection_model_1.Inspection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InspectionService);
//# sourceMappingURL=inspection.service.js.map