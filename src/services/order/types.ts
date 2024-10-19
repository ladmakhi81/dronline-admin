import { ScheduleType } from "../schedule/types";
import { Transaction } from "../transaction/types";
import { User } from "../user/types";

export enum OrderStatus {
  Done = "Done",
  Cancel = "Cancel",
  Pending = "Pending",
  NotPayed = "NotPayed",
}

export interface Order {
  // documentation: UserDocumentationEntity[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
  patient: User;
  doctor: User;
  day: number;
  city: string;
  address: string;
  date: string;
  room: number;
  type: ScheduleType;
  startHour: string;
  endHour: string;
  status: OrderStatus;
  transaction: Transaction;
}
