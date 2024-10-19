import {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  RegisterCredentials,
  RegisterResponse,
} from "../types/user";
import api from "./config";

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    // Handle the error appropriately, e.g., log it or throw a custom error
    console.error("Login API error:", error);
    throw new Error(
      "Failed to login. Please check your credentials and try again."
    );
  }
};

export const signUp = async (
  credentials: RegisterCredentials
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw new Error(
      "Failed to register. Please check your credentials and try again."
    );
  }
};

export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await api.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      { token: refreshToken }
    );
    return response.data;
  } catch (error) {
    console.error("Refresh token API error:", error);
    throw new Error("Failed to refresh token. Please login again.");
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
    throw new Error("Failed to logout. Please try again.");
  }
};
