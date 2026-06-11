"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const common_1 = require("@nestjs/common");
class ApiResponse {
    constructor(success, message, data, status) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.status = status;
    }
    static ok(message, data) {
        return new ApiResponse(true, message, data, common_1.HttpStatus.OK);
    }
    static created(message, data) {
        return new ApiResponse(true, message, data, common_1.HttpStatus.CREATED);
    }
    static badRequest(message, data) {
        return new ApiResponse(false, message, data, common_1.HttpStatus.BAD_REQUEST);
    }
    static notFound(message, data) {
        return new ApiResponse(false, message, data, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response.util.js.map