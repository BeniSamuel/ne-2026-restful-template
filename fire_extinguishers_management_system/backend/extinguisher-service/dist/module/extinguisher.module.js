"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtinguisherModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fire_extinguisher_model_1 = require("../model/fire-extinguisher.model");
const extinguisher_controller_1 = require("./extinguisher.controller");
const extinguisher_service_1 = require("./extinguisher.service");
let ExtinguisherModule = class ExtinguisherModule {
};
exports.ExtinguisherModule = ExtinguisherModule;
exports.ExtinguisherModule = ExtinguisherModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fire_extinguisher_model_1.FireExtinguisher])],
        controllers: [extinguisher_controller_1.ExtinguisherController],
        providers: [extinguisher_service_1.ExtinguisherService],
    })
], ExtinguisherModule);
//# sourceMappingURL=extinguisher.module.js.map