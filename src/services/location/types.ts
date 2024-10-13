import { Schedule } from "@/services/schedule/types";
import { PageableQuery } from "@/shared-types";

export interface Location {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  address: string;
  doctorSchedules: Schedule[];
}

export interface CreateOrEditLocationReqBody {
  city: string;
  address: string;
}

export type GetLocationsQuery = PageableQuery;
