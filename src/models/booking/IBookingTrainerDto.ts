export interface IBookingTrainerDto {
  id: number;
  bookingDate: Date | null;
  status: {
    id: number;
    name: string;
  } | null;
  user: {
    id: number;
    email: string;
    fullName: string | null;
  } | null;
  class?: {
    id: number;
    title: string;
    capacity: number | null;
    created_at: Date,
    class_date: Date,
    start_time: string,
    end_time: string,
  } | null;
}
