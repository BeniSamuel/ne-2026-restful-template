"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require('dotenv').config();
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const reporting_controller_1 = require("./module/reporting.controller");
const reporting_service_1 = require("./module/reporting.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'EXTINGUISHER_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: { host: 'localhost', port: 3003 },
                },
                {
                    name: 'INSPECTION_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: { host: 'localhost', port: 3004 },
                },
                {
                    name: 'MAINTENANCE_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: { host: 'localhost', port: 3005 },
                },
            ]),
        ],
        controllers: [reporting_controller_1.ReportingController],
        providers: [reporting_service_1.ReportingService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map