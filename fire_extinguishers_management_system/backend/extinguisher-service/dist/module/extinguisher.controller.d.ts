import { ExtinguisherService } from './extinguisher.service';
export declare class ExtinguisherController {
    private readonly extinguisherService;
    constructor(extinguisherService: ExtinguisherService);
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
