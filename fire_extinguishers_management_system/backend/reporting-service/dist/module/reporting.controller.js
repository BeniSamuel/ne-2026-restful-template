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
exports.ReportingController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const reporting_service_1 = require("./reporting.service");
let ReportingController = class ReportingController {
    constructor(reportingService) {
        this.reportingService = reportingService;
    }
    extinguishers(query) {
        return this.reportingService.extinguishers(query);
    }
    inspectionStatus() {
        return this.reportingService.inspectionStatus();
    }
    expired() {
        return this.reportingService.expired();
    }
    maintenanceHistory() {
        return this.reportingService.maintenanceHistory();
    }
};
exports.ReportingController = ReportingController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'report-extinguishers' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportingController.prototype, "extinguishers", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'report-inspection-status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportingController.prototype, "inspectionStatus", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'report-expired' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportingController.prototype, "expired", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'report-maintenance-history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportingController.prototype, "maintenanceHistory", null);
exports.ReportingController = ReportingController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reporting_service_1.ReportingService])
], ReportingController);
//# sourceMappingURL=reporting.controller.js.map