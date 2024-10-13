import { Schedule } from "@/services/schedule/types";

export interface Location {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  address: string;
  doctorSchedules: Schedule[];
}
