import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T,
    public status: HttpStatus,
  ) {}

  static ok<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(true, message, data, HttpStatus.OK);
  }

  static created<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(true, message, data, HttpStatus.CREATED);
  }

  static badRequest<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(false, message, data, HttpStatus.BAD_REQUEST);
  }

  static notFound<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(false, message, data, HttpStatus.NOT_FOUND);
  }
}
