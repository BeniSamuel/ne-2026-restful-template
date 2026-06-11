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
exports.ExtinguisherController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const extinguisher_service_1 = require("./extinguisher.service");
let ExtinguisherController = class ExtinguisherController {
    constructor(extinguisherService) {
        this.extinguisherService = extinguisherService;
    }
    create(payload) {
        return this.extinguisherService.create(payload);
    }
    findAll(query) {
        return this.extinguisherService.findAll(query);
    }
    findOne(payload) {
        return this.extinguisherService.findOne(payload.id);
    }
    update(payload) {
        return this.extinguisherService.update(payload.id, payload.data);
    }
    remove(payload) {
        return this.extinguisherService.remove(payload.id);
    }
};
exports.ExtinguisherController = ExtinguisherController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'create-extinguisher' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtinguisherController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get-extinguishers' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtinguisherController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get-extinguisher-by-id' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtinguisherController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'update-extinguisher' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtinguisherController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'delete-extinguisher' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtinguisherController.prototype, "remove", null);
exports.ExtinguisherController = ExtinguisherController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [extinguisher_service_1.ExtinguisherService])
], ExtinguisherController);
//# sourceMappingURL=extinguisher.controller.js.map