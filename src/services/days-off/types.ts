import { Schedule } from "../schedule/types";

export interface DaysOff {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  schedule: Schedule;
  date: string;
}
