import { SuccessResponse } from "../types/common";
import { ChangePassword, UpdateProfile, User } from "../types/user";
import api from "./config";

export const getProfile = async () => {
  try {
    const response = await api.get<SuccessResponse<User>>("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Get Profile API error:", error);
    throw new Error("Failed to get Profile.");
  }
};

export const updateProfile = async (data: UpdateProfile) => {
  try {
    const response = await api.patch<SuccessResponse<User>>(
      "/users/profile",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Update Profile API error:", error);
    throw new Error("Failed to update Profile.");
  }
};

export const changePassword = async (data: ChangePassword) => {
  try {
    const response = await api.patch<SuccessResponse<User>>(
      "/users/change-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Change Password API error:", error);
    throw new Error("Failed to change Password.");
  }
};
