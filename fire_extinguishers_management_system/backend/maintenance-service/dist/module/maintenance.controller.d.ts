import { MaintenanceService } from './maintenance.service';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    create(payload: any): Promise<import("../utils/response.util").ApiResponse<any>>;
    findAll(query: any): Promise<import("../utils/response.util").ApiResponse<any>>;
    findOne(payload: {
        id: string;
    }): Promise<import("../utils/response.util").ApiResponse<any>>;
    update(payload: {
        id: string;
        data: any;
    }): Promise<import("../utils/response.util").ApiResponse<any>>;
    remove(payload: {
        id: string;
    }): Promise<import("../utils/response.util").ApiResponse<boolean>>;
}
