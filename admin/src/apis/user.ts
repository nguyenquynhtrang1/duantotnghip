import { GetListResponse, SuccessResponse } from "../types/common";
import { GetListParamsUser, User, UserForm } from "../types/user";
import api from "./config";

export const getUsers = async (params: GetListParamsUser) => {
  try {
    const response = await api.get<GetListResponse<User>>("/users", { params });
    return response.data;
  } catch (error) {
    console.error("Get Users API error:", error);
    throw new Error("Failed to get Users.");
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await api.get<SuccessResponse<User>>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get User API error:", error);
    throw new Error("Failed to get User.");
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get<SuccessResponse<User>>("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Get Profile API error:", error);
    throw new Error("Failed to get Profile.");
  }
};

export const createUser = async (user: UserForm) => {
  try {
    const response = await api.post<User>("/users", user);
    return response.data;
  } catch (error) {
    console.error("Create User API error:", error);
    throw new Error("Failed to create User.");
  }
};

export const updateUser = async (id: string, user: Partial<UserForm>) => {
  try {
    const response = await api.patch<User>(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Update User API error:", error);
    throw new Error("Failed to update User.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error("Delete User API error:", error);
    throw new Error("Failed to delete User.");
  }
};

export const getTotalUsers = async () => {
  try {
    const response = await api.get<SuccessResponse<number>>("/users/total");
    return response.data;
  } catch (error) {
    console.error("Get Total API error:", error);
    throw new Error("Failed to get Total.");
  }
};
