import { HttpStatus } from '@nestjs/common';
export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: HttpStatus;
    constructor(success: boolean, message: string, data: T, status: HttpStatus);
    static ok<T>(message: string, data: T): ApiResponse<T>;
    static created<T>(message: string, data: T): ApiResponse<T>;
    static badRequest<T>(message: string, data: T): ApiResponse<T>;
    static notFound<T>(message: string, data: T): ApiResponse<T>;
}
