export interface WeightTrackingInfo {
    weightTrackingId: string; 
    userId: string; 
    dailycalories: number | undefined;
    inputWeekDay: string;
    week: number; 
    weight: number | undefined;
}   