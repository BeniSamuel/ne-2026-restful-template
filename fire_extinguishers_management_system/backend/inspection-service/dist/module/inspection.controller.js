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
exports.InspectionController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const inspection_service_1 = require("./inspection.service");
let InspectionController = class InspectionController {
    constructor(inspectionService) {
        this.inspectionService = inspectionService;
    }
    create(payload) {
        return this.inspectionService.create(payload);
    }
    findAll(query) {
        return this.inspectionService.findAll(query);
    }
    findOne(payload) {
        return this.inspectionService.findOne(payload.id);
    }
    update(payload) {
        return this.inspectionService.update(payload.id, payload.data);
    }
    remove(payload) {
        return this.inspectionService.remove(payload.id);
    }
};
exports.InspectionController = InspectionController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'create-inspection' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InspectionController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get-inspections' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InspectionController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get-inspection-by-id' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InspectionController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'update-inspection' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InspectionController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'delete-inspection' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InspectionController.prototype, "remove", null);
exports.InspectionController = InspectionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [inspection_service_1.InspectionService])
], InspectionController);
//# sourceMappingURL=inspection.controller.js.map