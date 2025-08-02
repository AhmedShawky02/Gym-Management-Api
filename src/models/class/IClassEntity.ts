import { Decimal } from "@prisma/client/runtime/library";

export interface IClassEntity {
  id: number;
  title: string;
  trainers: {
    id: number,
    users: {
      persons: {
        first_name: string,
        middle_name: string | null,
        last_name: string | null
      }
    }
  };
  description: string;
  capacity: number;
  price: Decimal;
  class_date: Date;
  start_time: string;
  end_time: string;
  created_at: Date;
  _count?: {
    bookings: number
  }
}
