import { GetListParams, SuccessResponse } from "./common";

export interface User {
  _id: string;
  email: string;
  username: string;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserForm {
  email: string;
  username: string;
  password: string;
  phone?: string;
  isAdmin?: boolean;
}

export type GetListParamsUser = GetListParams<object>;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = SuccessResponse<{
  user: User;
  token: string;
  refreshToken: string;
}>;

export type RegisterCredentials = {
  email: string;
  password: string;
  username: string;
  phone?: string;
  isAdmin?: boolean;
};

export type RegisterResponse = SuccessResponse<{
  user: User;
  token: string;
  refreshToken: string;
}>;

export type RefreshTokenResponse = SuccessResponse<{
  token: string;
}>;