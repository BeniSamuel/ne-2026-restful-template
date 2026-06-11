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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireExtinguisher = exports.ExtinguisherStatus = exports.ExtinguisherSize = exports.ExtinguisherType = void 0;
const typeorm_1 = require("typeorm");
var ExtinguisherType;
(function (ExtinguisherType) {
    ExtinguisherType["WATER"] = "WATER";
    ExtinguisherType["CARBON_DIOXIDE"] = "CARBON_DIOXIDE";
    ExtinguisherType["FOAM"] = "FOAM";
    ExtinguisherType["DRY_CHEMICAL"] = "DRY_CHEMICAL";
})(ExtinguisherType || (exports.ExtinguisherType = ExtinguisherType = {}));
var ExtinguisherSize;
(function (ExtinguisherSize) {
    ExtinguisherSize["TWO_POINT_FIVE_LBS"] = "2.5_LBS";
    ExtinguisherSize["FIVE_LBS"] = "5_LBS";
    ExtinguisherSize["NINE_LBS"] = "9_LBS";
    ExtinguisherSize["TWELVE_LBS"] = "12_LBS";
})(ExtinguisherSize || (exports.ExtinguisherSize = ExtinguisherSize = {}));
var ExtinguisherStatus;
(function (ExtinguisherStatus) {
    ExtinguisherStatus["ACTIVE"] = "ACTIVE";
    ExtinguisherStatus["EXPIRED"] = "EXPIRED";
    ExtinguisherStatus["UNDER_MAINTENANCE"] = "UNDER_MAINTENANCE";
    ExtinguisherStatus["DECOMMISSIONED"] = "DECOMMISSIONED";
})(ExtinguisherStatus || (exports.ExtinguisherStatus = ExtinguisherStatus = {}));
let FireExtinguisher = class FireExtinguisher {
};
exports.FireExtinguisher = FireExtinguisher;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ExtinguisherType }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ExtinguisherSize }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "installationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExtinguisherStatus,
        default: ExtinguisherStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], FireExtinguisher.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FireExtinguisher.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FireExtinguisher.prototype, "updatedAt", void 0);
exports.FireExtinguisher = FireExtinguisher = __decorate([
    (0, typeorm_1.Entity)('fire_extinguishers')
], FireExtinguisher);
//# sourceMappingURL=fire-extinguisher.model.js.map