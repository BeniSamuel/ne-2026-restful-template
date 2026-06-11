export declare enum ExtinguisherType {
    WATER = "WATER",
    CARBON_DIOXIDE = "CARBON_DIOXIDE",
    FOAM = "FOAM",
    DRY_CHEMICAL = "DRY_CHEMICAL"
}
export declare enum ExtinguisherSize {
    TWO_POINT_FIVE_LBS = "2.5_LBS",
    FIVE_LBS = "5_LBS",
    NINE_LBS = "9_LBS",
    TWELVE_LBS = "12_LBS"
}
export declare enum ExtinguisherStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
    DECOMMISSIONED = "DECOMMISSIONED"
}
export declare class FireExtinguisher {
    id: string;
    serialNumber: string;
    location: string;
    type: ExtinguisherType;
    size: ExtinguisherSize;
    installationDate: string;
    expiryDate: string;
    status: ExtinguisherStatus;
    createdAt: Date;
    updatedAt: Date;
}
