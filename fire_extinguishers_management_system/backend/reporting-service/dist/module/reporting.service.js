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
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let ReportingService = class ReportingService {
    constructor(extinguisherClient, inspectionClient, maintenanceClient) {
        this.extinguisherClient = extinguisherClient;
        this.inspectionClient = inspectionClient;
        this.maintenanceClient = maintenanceClient;
    }
    async extinguishers(query = {}) {
        const response = await (0, rxjs_1.firstValueFrom)(this.extinguisherClient.send({ cmd: 'get-extinguishers' }, { ...query, limit: 100 }));
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
        const response = await (0, rxjs_1.firstValueFrom)(this.inspectionClient.send({ cmd: 'get-inspections' }, {}));
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
        const response = await (0, rxjs_1.firstValueFrom)(this.extinguisherClient.send({ cmd: 'get-extinguishers' }, { limit: 100 }));
        const today = new Date();
        const items = (response.data?.items ?? []).filter((item) => new Date(item.expiryDate) < today || item.status === 'EXPIRED');
        return {
            success: true,
            message: 'Expired extinguisher report generated successfully',
            data: { total: items.length, items },
            status: 200,
        };
    }
    async maintenanceHistory() {
        const response = await (0, rxjs_1.firstValueFrom)(this.maintenanceClient.send({ cmd: 'get-maintenance' }, {}));
        const items = response.data?.items ?? response.data ?? [];
        return {
            success: true,
            message: 'Maintenance history report generated successfully',
            data: { total: items.length, items },
            status: 200,
        };
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('EXTINGUISHER_SERVICE')),
    __param(1, (0, common_1.Inject)('INSPECTION_SERVICE')),
    __param(2, (0, common_1.Inject)('MAINTENANCE_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map