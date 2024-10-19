import { GetListResponse, SuccessResponse } from "../types/common";
import { GetListParamsRoom, Room, RoomForm } from "../types/room";
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
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get room API error:", error);
    throw new Error("Failed to get room.");
  }
};

export const createRoom = async (room: RoomForm) => {
  try {
    const response = await api.post<Room>("/rooms", room);
    return response.data;
  } catch (error) {
    console.error("Create room API error:", error);
    throw new Error("Failed to create room.");
  }
};

export const updateRoom = async (id: string, room: Partial<RoomForm>) => {
  try {
    const response = await api.patch<Room>(`/rooms/${id}`, room);
    return response.data;
  } catch (error) {
    console.error("Update room API error:", error);
    throw new Error("Failed to update room.");
  }
};

export const deleteRoom = async (id: string) => {
  try {
    await api.delete(`/rooms/${id}`);
  } catch (error) {
    console.error("Delete room API error:", error);
    throw new Error("Failed to delete room.");
  }
};

export const getTotalRooms = async () => {
  try {
    const response = await api.get<SuccessResponse<number>>("/rooms/total");
    return response.data;
  } catch (error) {
    console.error("Get total API error:", error);
    throw new Error("Failed to get total.");
  }
};
