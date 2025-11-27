export enum RideType {
    Regular,
    Premimum,
    Go,
    Sedan,
    Intercity
}

export interface DriversResponse {
    driverId: string; 
    requestId: string; 
    accepted: boolean
}