export interface WeightTrackingInfo {
    weightTrackingId: string; 
    userId: string; 
    dailycalories: number | undefined;
    inputWeekDay: string;
    week: number; 
    weight: number | undefined;
}   

export interface avgData{
    week: number; 
    avg_calories: number; 
    avg_weight: number; 
    delta_weight: number; 
}