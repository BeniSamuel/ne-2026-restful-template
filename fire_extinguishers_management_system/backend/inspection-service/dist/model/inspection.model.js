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
exports.Inspection = exports.InspectionStatus = void 0;
const typeorm_1 = require("typeorm");
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "SCHEDULED";
    InspectionStatus["PASSED"] = "PASSED";
    InspectionStatus["FAILED"] = "FAILED";
    InspectionStatus["CANCELLED"] = "CANCELLED";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
let Inspection = class Inspection {
};
exports.Inspection = Inspection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Inspection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inspection.prototype, "extinguisherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inspection.prototype, "inspectorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Inspection.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InspectionStatus,
        default: InspectionStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Inspection.prototype, "inspectionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inspection.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inspection.prototype, "createdAt", void 0);
exports.Inspection = Inspection = __decorate([
    (0, typeorm_1.Entity)('inspections')
], Inspection);
//# sourceMappingURL=inspection.model.js.map