import { OnModuleInit } from '@nestjs/common';
import { Inspection } from 'src/model/inspection.model';
import { ApiResponse } from 'src/utils/response.util';
import { Repository } from 'typeorm';
export declare class InspectionService implements OnModuleInit {
    private readonly repository;
    constructor(repository: Repository<Inspection>);
    onModuleInit(): Promise<void>;
    create(payload: Partial<Inspection>): Promise<ApiResponse<any>>;
    findAll(query?: any): Promise<ApiResponse<any>>;
    findOne(id: string): Promise<ApiResponse<any>>;
    update(id: string, data: Partial<Inspection>): Promise<ApiResponse<any>>;
    remove(id: string): Promise<ApiResponse<boolean>>;
    private validateInspection;
    private validateDateRange;
    private parseDate;
    private allowedSort;
}
