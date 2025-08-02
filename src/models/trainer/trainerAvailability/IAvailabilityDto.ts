export interface IAvailabilityDto {
  id: number;
  week_day_id: number;
  week_day_name?: string;
  start_time: string;
  end_time: string;
}
