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
