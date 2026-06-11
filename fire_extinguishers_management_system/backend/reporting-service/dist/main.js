"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: process.env.SERVICE_HOST ?? 'localhost',
            port: Number(process.env.SERVICE_PORT ?? 3006),
        },
    });
    await app.listen();
    console.log('Reporting service running on port 3006');
}
bootstrap();
//# sourceMappingURL=main.js.map