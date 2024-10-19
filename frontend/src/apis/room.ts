import { GetListResponse, SuccessResponse } from "../types/common";
import { GetListParamsRoom, Room } from "../types/room";
import api from "./config";

export const getRooms = async (params: GetListParamsRoom) => {
  try {
    const response = await api.get<GetListResponse<Room>>("/rooms", { params });
    return response.data;
  } catch (error) {
    console.error("Get rooms API error:", error);
    throw new Error("Failed to get rooms.");
  }
};

export const getRoom = async (id: string) => {
  try {
    const response = await api.get<SuccessResponse<Room>>(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get room API error:", error);
    throw new Error("Failed to get room.");
  }
};
