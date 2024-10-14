import { PageableQuery } from "@/shared-types";

export enum UserType {
  Admin = "Admin",
  Patient = "Patient",
  Doctor = "Doctor",
}

export enum DegtreeOfEducation {
  diploma = "diploma",
  associate = "associate",
  bachelor = "bachelor",
  master = "master",
  doctorate = "doctorate",
}

export enum Gender {
  male = "male",
  female = "female",
  unknown = "unknown",
}

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  phone: string;
  phone2: string;
  bio: string;
  address: string;
  degreeOfEducation: DegtreeOfEducation;
  gender: Gender;
  image: string;
  isActive?: boolean;
  password: string;
  //   orders: OrderEntity[];
  //   workingFields: CategoryEntity[];
  //   schedules: ScheduleEntity[];
  //   patientsOrders: OrderEntity[];
  type: UserType;
}

export type GetUsersQuery = PageableQuery<{
  type: UserType;
}>;

export interface CreatePatientReqBody {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface CreateAdminReqBody {
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  password: string;
}

export interface CreateDoctorReqBody {
  firstName: string;
  lastName: string;
  phone: string;
  phone2: string;
  password: string;
  degreeOfEducation: DegtreeOfEducation;
  address: string;
  bio: string;
  gender: Gender;
  image: string;
  workingFields: number[];
}

export type EditPatientReqBody = Partial<CreatePatientReqBody>;

export type EditAdminReqBody = Partial<CreateAdminReqBody>;

export type EditDoctorReqBody = Partial<CreateDoctorReqBody>;

export type CreateUserReqBody =
  | CreateAdminReqBody
  | CreateDoctorReqBody
  | CreatePatientReqBody;

export type EditUserReqBody =
  | EditPatientReqBody
  | EditDoctorReqBody
  | EditAdminReqBody;

export interface EditPasswordReqBody {
  password: string;
}
