import { Location } from "@/services/location/types";
import { User } from "@/services/user/types";
import { DaysOff } from "../days-off/types";
import { PageableQuery } from "@/shared-types";

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
  daysOff: DaysOff[];
}

export interface AddScheduleReqBody {
  startHour: string;
  endHour: string;
  day: number;
  location: number;
  room: number;
  type: ScheduleType;
  doctor: number;
}

export type GetSchedulesQuery = PageableQuery<{
  day?: number;
  doctor?: number;
  type?: ScheduleType;
}>;
