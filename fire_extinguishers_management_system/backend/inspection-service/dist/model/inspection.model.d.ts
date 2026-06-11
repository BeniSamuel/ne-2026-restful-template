export declare enum InspectionStatus {
    SCHEDULED = "SCHEDULED",
    PASSED = "PASSED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class Inspection {
    id: string;
    extinguisherId: string;
    inspectorId: string;
    scheduledDate: Date;
    inspectionStatus: InspectionStatus;
    notes?: string;
    createdAt: Date;
}
