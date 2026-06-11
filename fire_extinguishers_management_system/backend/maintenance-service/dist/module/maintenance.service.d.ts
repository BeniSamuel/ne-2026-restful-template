import { OnModuleInit } from '@nestjs/common';
import { Maintenance } from 'src/model/maintenance.model';
import { ApiResponse } from 'src/utils/response.util';
import { Repository } from 'typeorm';
export declare class MaintenanceService implements OnModuleInit {
    private readonly repository;
    constructor(repository: Repository<Maintenance>);
    onModuleInit(): Promise<void>;
    create(payload: Partial<Maintenance>): Promise<ApiResponse<any>>;
    findAll(query?: any): Promise<ApiResponse<any>>;
    findOne(id: string): Promise<ApiResponse<any>>;
    update(id: string, data: Partial<Maintenance>): Promise<ApiResponse<any>>;
    remove(id: string): Promise<ApiResponse<boolean>>;
    private validateMaintenance;
    private validateDateRange;
    private parseDate;
    private allowedSort;
}
