export interface ITrainerAvailabilityDto {
    id: number;
    trainer_id: number;
    week_day_id: number;
    week_day_name?: string;
    start_time: string; // ISO time string
    end_time: string;   // ISO time string
} 