import { ReportingService } from './reporting.service';
export declare class ReportingController {
    private readonly reportingService;
    constructor(reportingService: ReportingService);
    extinguishers(query: any): Promise<{
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
