export interface ITrainerAvailability {
  id: number;
  trainer_id: number;
  start_time: string;
  end_time: string;
  created_at: Date
  week_days?: {
    id: number;
    name: string | undefined;
  };
}