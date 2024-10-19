import {
  Booking,
  BookingForm,
  BookingStatus,
  BookingStatusForm,
  GetListParamsBooking,
} from "../types/booking";
import { GetListResponse, SuccessResponse } from "../types/common";
import api from "./config";

export const getBookings = async (params: GetListParamsBooking) => {
  try {
    const response = await api.get<GetListResponse<Booking>>("/bookings", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get Bookings API error:", error);
  }
};

export const getBooking = async (id: string) => {
  try {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Booking API error:", error);
  }
};

export const createBooking = async (booking: BookingForm) => {
  try {
    const response = await api.post<Booking>("/bookings/admin", booking);
    return response.data;
  } catch (error) {
    console.error("Create Booking API error:", error);
  }
};

export const updateBooking = async (id: string, form: BookingStatusForm) => {
  try {
    const response = await api.patch<Booking>(`/bookings/admin/${id}`, form);
    return response.data;
  } catch (error) {
    console.error("Update Booking API error:", error);
  }
};

export const deleteBooking = async (id: string) => {
  try {
    await api.delete(`/bookings/${id}`);
  } catch (error) {
    console.error("Delete Booking API error:", error);
  }
};

export const getRevenueByMonth = async (params: { year: number }) => {
  try {
    const res = await api.get<
      SuccessResponse<
        {
          month: string;
          totalRevenue: number;
          bookings: number;
        }[]
      >
    >("/bookings/revenueByMonth", { params });
    return res.data;
  } catch (error) {
    console.log("🚀 ~ getRevenue ~ error:", error);
  }
};

export const getRevenueByRoomType = async (params: { year: number }) => {
  try {
    const res = await api.get<
      SuccessResponse<
        {
          roomType: string;
          totalRevenue: number;
          bookings: number;
        }[]
      >
    >("bookings/revenueByRoomType", { params });
    return res.data;
  } catch (error) {
    console.log("🚀 ~ getRevenue ~ error:", error);
  }
};

export const getTotalBookings = async () => {
  try {
    const response = await api.get<
      SuccessResponse<
        {
          count: number;
          status: BookingStatus;
        }[]
      >
    >("/bookings/total");
    return response.data;
  } catch (error) {
    console.error("Get total API error:", error);
  }
};
