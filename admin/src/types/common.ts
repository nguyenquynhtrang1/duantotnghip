export type SuccessResponse<T> = {
  data: T;
  message: string;
};

export type ErrorResponse = {
  message: string;
};

export type GetListParams<T> = {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  sortBy?: "asc" | "desc";
} & T;

export type GetListResponse<T> = {
  data: T[];
  total: number;
  message: string;
};

export type GetOneResponse<T> = {
  data: T;
  message: string;
};
