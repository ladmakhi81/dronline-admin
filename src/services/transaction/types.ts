import { Order } from "../order/types";
import { User } from "../user/types";

export enum TransactionStatus {
  Payed = "Payed",
  NotPayed = "NotPayed",
}

export interface Transaction {
  amount: number;
  order: Order;
  payedAt: Date;
  payedLink: string;
  authority: string;
  refId: number;
  status: TransactionStatus;
  customer: User;
  doctor: User;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
