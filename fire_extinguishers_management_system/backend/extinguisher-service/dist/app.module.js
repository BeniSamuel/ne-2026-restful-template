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
const typeorm_1 = require("@nestjs/typeorm");
const extinguisher_module_1 = require("./module/extinguisher.module");
const fire_extinguisher_model_1 = require("./model/fire-extinguisher.model");
const env = process.env;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: env.DB_HOST ?? 'localhost',
                port: Number(env.DB_PORT ?? 5432),
                username: env.DB_USERNAME ?? 'postgres',
                password: env.DB_PASSWORD ?? 'beni@ish',
                database: env.DB_NAME ?? 'fire_mns_extinguisher_service_db',
                entities: [fire_extinguisher_model_1.FireExtinguisher],
                synchronize: true,
            }),
            extinguisher_module_1.ExtinguisherModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map