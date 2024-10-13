import { Location } from "@/services/location/types";
import { User } from "@/services/user/types";

export enum ScheduleType {
  online = "online",
  onsite = "onsite",
  both = "both",
}

export interface Schedule {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  doctor: User;
  day: number;
  startHour: string;
  endHour: string;
  location: Location;
  type: ScheduleType;
  room: number;
  //   daysOff: DaysOffEntity[];
}
