import { PageableQuery } from "@/shared-types";
import { User } from "../user/types";

export interface Category {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  doctors: User[];
  icon: string;
}

export type GetCategoriesQuery = PageableQuery;

export interface CreateCategoryReqBody {
  name: string;
  icon: string;
}
