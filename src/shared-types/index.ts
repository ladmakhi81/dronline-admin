export interface PageableApi<T> {
  count: number;
  content: T[];
}

export type PageableQuery<T = object> = T & {
  page?: number;
  limit?: number;
};
