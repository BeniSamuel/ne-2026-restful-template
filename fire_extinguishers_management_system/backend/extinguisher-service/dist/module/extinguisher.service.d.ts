import { OnModuleInit } from '@nestjs/common';
import { FireExtinguisher } from 'src/model/fire-extinguisher.model';
import { ApiResponse } from 'src/utils/response.util';
import { Repository } from 'typeorm';
export declare class ExtinguisherService implements OnModuleInit {
    private readonly repository;
    constructor(repository: Repository<FireExtinguisher>);
    onModuleInit(): Promise<void>;
    create(payload: Partial<FireExtinguisher>): Promise<ApiResponse<any>>;
    findAll(query?: any): Promise<ApiResponse<any>>;
    findOne(id: string): Promise<ApiResponse<any>>;
    update(id: string, data: Partial<FireExtinguisher>): Promise<ApiResponse<any>>;
    remove(id: string): Promise<ApiResponse<boolean>>;
    private validateExtinguisher;
    private validateDateRange;
    private parseDate;
    private allowedSort;
}
