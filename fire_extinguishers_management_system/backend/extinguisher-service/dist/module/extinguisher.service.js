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
exports.ExtinguisherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fire_extinguisher_model_1 = require("../model/fire-extinguisher.model");
const response_util_1 = require("../utils/response.util");
const typeorm_2 = require("typeorm");
let ExtinguisherService = class ExtinguisherService {
    constructor(repository) {
        this.repository = repository;
    }
    async onModuleInit() {
        const count = await this.repository.count();
        if (count > 0)
            return;
        await this.repository.save({
            id: '44444444-4444-4444-4444-444444444444',
            serialNumber: 'TZW-FE-001',
            location: 'Main Office - Reception',
            type: 'DRY_CHEMICAL',
            size: '5_LBS',
            installationDate: '2025-01-15',
            expiryDate: '2027-01-15',
            status: 'ACTIVE',
        });
    }
    async create(payload) {
        const validationError = this.validateExtinguisher(payload);
        if (validationError) {
            return response_util_1.ApiResponse.badRequest(validationError, null);
        }
        const existing = await this.repository.findOne({
            where: { serialNumber: payload.serialNumber },
        });
        if (existing) {
            return response_util_1.ApiResponse.badRequest('Serial number already exists', null);
        }
        const saved = await this.repository.save(this.repository.create(payload));
        return response_util_1.ApiResponse.created('Extinguisher created successfully', saved);
    }
    async findAll(query = {}) {
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
            return response_util_1.ApiResponse.badRequest(dateRangeError, null);
        }
        const builder = this.repository.createQueryBuilder('extinguisher');
        if (query.status)
            builder.andWhere('extinguisher.status = :status', { status: query.status });
        if (query.type)
            builder.andWhere('extinguisher.type = :type', { type: query.type });
        if (query.size)
            builder.andWhere('extinguisher.size = :size', { size: query.size });
        if (query.expiryFrom)
            builder.andWhere('extinguisher.expiryDate >= :expiryFrom', { expiryFrom: query.expiryFrom });
        if (query.expiryTo)
            builder.andWhere('extinguisher.expiryDate <= :expiryTo', { expiryTo: query.expiryTo });
        if (query.search) {
            builder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('extinguisher.serialNumber ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('extinguisher.location ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('CAST(extinguisher.type AS TEXT) ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('CAST(extinguisher.status AS TEXT) ILIKE :search', { search: `%${query.search}%` });
            }));
        }
        const [items, total] = await builder
            .orderBy(`extinguisher.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return response_util_1.ApiResponse.ok('Extinguishers obtained successfully', {
            items,
            total,
            page,
            limit,
        });
    }
    async findOne(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Extinguisher not found', null);
        return response_util_1.ApiResponse.ok('Extinguisher obtained successfully', item);
    }
    async update(id, data) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Extinguisher not found', null);
        const merged = { ...item, ...data };
        const validationError = this.validateExtinguisher(merged);
        if (validationError) {
            return response_util_1.ApiResponse.badRequest(validationError, null);
        }
        Object.assign(item, data);
        return response_util_1.ApiResponse.ok('Extinguisher updated successfully', await this.repository.save(item));
    }
    async remove(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item)
            return response_util_1.ApiResponse.notFound('Extinguisher not found', false);
        await this.repository.delete(id);
        return response_util_1.ApiResponse.ok('Extinguisher deleted successfully', true);
    }
    validateExtinguisher(payload) {
        if (!payload.serialNumber?.trim())
            return 'Serial number is required';
        if (!payload.location?.trim())
            return 'Location is required';
        if (!Object.values(fire_extinguisher_model_1.ExtinguisherType).includes(payload.type))
            return 'Invalid extinguisher type';
        if (!Object.values(fire_extinguisher_model_1.ExtinguisherSize).includes(payload.size))
            return 'Invalid extinguisher size';
        if (!Object.values(fire_extinguisher_model_1.ExtinguisherStatus).includes(payload.status))
            return 'Invalid extinguisher status';
        const installationDate = this.parseDate(payload.installationDate);
        const expiryDate = this.parseDate(payload.expiryDate);
        if (!installationDate)
            return 'Installation date must be a valid date';
        if (!expiryDate)
            return 'Expiry date must be a valid date';
        if (expiryDate < installationDate)
            return 'Expiry date cannot be before installation date';
        return null;
    }
    validateDateRange(from, to) {
        const fromDate = from ? this.parseDate(from) : null;
        const toDate = to ? this.parseDate(to) : null;
        if (from && !fromDate)
            return 'expiryFrom must be a valid date';
        if (to && !toDate)
            return 'expiryTo must be a valid date';
        if (fromDate && toDate && toDate < fromDate)
            return 'expiryTo cannot be before expiryFrom';
        return null;
    }
    parseDate(value) {
        if (!value)
            return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    allowedSort(sortBy, allowed) {
        return allowed.includes(sortBy ?? '') ? sortBy : 'createdAt';
    }
};
exports.ExtinguisherService = ExtinguisherService;
exports.ExtinguisherService = ExtinguisherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fire_extinguisher_model_1.FireExtinguisher)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExtinguisherService);
//# sourceMappingURL=extinguisher.service.js.map