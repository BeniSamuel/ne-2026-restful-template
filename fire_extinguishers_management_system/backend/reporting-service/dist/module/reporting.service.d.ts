import { ClientProxy } from '@nestjs/microservices';
export declare class ReportingService {
    private readonly extinguisherClient;
    private readonly inspectionClient;
    private readonly maintenanceClient;
    constructor(extinguisherClient: ClientProxy, inspectionClient: ClientProxy, maintenanceClient: ClientProxy);
    extinguishers(query?: any): Promise<{
        success: boolean;
        message: string;
        data: {
            total: any;
            byStatus: any;
            items: any;
        };
        status: number;
    }>;
    inspectionStatus(): Promise<{
        success: boolean;
        message: string;
        data: {
            total: any;
            byStatus: any;
            items: any;
        };
        status: number;
    }>;
    expired(): Promise<{
        success: boolean;
        message: string;
        data: {
            total: any;
            items: any;
        };
        status: number;
    }>;
    maintenanceHistory(): Promise<{
        success: boolean;
        message: string;
        data: {
            total: any;
            items: any;
        };
        status: number;
    }>;
}
