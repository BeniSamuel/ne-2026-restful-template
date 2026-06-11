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
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_model_1 = require("../model/maintenance.model");
const response_util_1 = require("../utils/response.util");
const typeorm_2 = require("typeorm");
let MaintenanceService = class MaintenanceService {
    constructor(repository) {
        this.repository = repository;
    }
    async onModuleInit() {
        const count = await this.repository.count();
        if (count > 0)
            return;
        await this.repository.save({
            id: '66666666-6666-6666-6666-666666666666',
            extinguisherId: '44444444-4444-4444-4444-444444444444',
            inspectorId: '22222222-2222-2222-2222-222222222222',
            actionTaken: 'Pressure gauge checked and safety pin verified.',
            conditionNoted: 'Good operating condition.',
            actionDate: new Date('2026-06-01T10:30:00'),
        });
    }
    async create(payload) {
        const validationError = this.validateMaintenance(payload);
        if (validationError)
            return response_util_1.ApiResponse.badRequest(validationError, null);
        const saved = await this.repository.save(this.repository.create(payload));
        return response_util_1.ApiResponse.created('Maintenance record created successfully', saved);
    }
    async findAll(query = {}) {
        const page = Math.max(Number(query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
        const sortBy = this.allowedSort(query.sortBy, ['actionDate', 'createdAt']);
        const sortOrder = String(query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const dateRangeError = this.validateDateRange(query.dateFrom, query.dateTo);
        if (dateRangeError)
            return response_util_1.ApiResponse.badRequest(dateRangeError, null);
        const builder = this.repository.createQueryBuilder('maintenance');
        if (query.inspectorId)
            builder.andWhere('maintenance.inspectorId = :inspectorId', { inspectorId: query.inspectorId });
        if (query.extinguisherId)
            builder.andWhere('maintenance.extinguisherId = :extinguisherId', { extinguisherId: query.extinguisherId });
        if (query.dateFrom)
            builder.andWhere('maintenance.actionDate >= :dateFrom', { dateFrom: query.dateFrom });
        if (query.dateTo)
            builder.andWhere('maintenance.actionDate <= :dateTo', { dateTo: query.dateTo });
        if (query.search) {
            builder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('maintenance.extinguisherId ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('maintenance.inspectorId ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('maintenance.actionTaken ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('maintenance.conditionNoted ILIKE :search', { search: `%${query.search}%` });
            }));
        }
        const [items, total] = await builder
            .orderBy(`maintenance.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return response_util_1.ApiResponse.ok('Maintenance records obtained successfully', { items, total, page, limit });
    }
    async findOne(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Maintenance record not found', null);
        return response_util_1.ApiResponse.ok('Maintenance record obtained successfully', item);
    }
    async update(id, data) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Maintenance record not found', null);
        const merged = { ...item, ...data };
        const validationError = this.validateMaintenance(merged);
        if (validationError)
            return response_util_1.ApiResponse.badRequest(validationError, null);
        Object.assign(item, data);
        return response_util_1.ApiResponse.ok('Maintenance record updated successfully', await this.repository.save(item));
    }
    async remove(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Maintenance record not found', false);
        await this.repository.delete(id);
        return response_util_1.ApiResponse.ok('Maintenance record deleted successfully', true);
    }
    validateMaintenance(payload) {
        if (!payload.extinguisherId?.trim())
            return 'Extinguisher ID is required';
        if (!payload.inspectorId?.trim())
            return 'Inspector ID is required';
        if (!payload.actionTaken?.trim())
            return 'Action taken is required';
        if (!payload.conditionNoted?.trim())
            return 'Condition noted is required';
        const actionDate = this.parseDate(payload.actionDate);
        if (!actionDate)
            return 'Action date must be a valid date';
        if (actionDate.getTime() > Date.now())
            return 'Action date cannot be in the future';
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
        return allowed.includes(sortBy ?? '') ? sortBy : 'actionDate';
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_model_1.Maintenance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map