import { Booking, BookingForm, GetListParamsBooking } from "../types/booking";
import { GetListResponse, SuccessResponse } from "../types/common";
import api from "./config";

export const getBookings = async (params: GetListParamsBooking) => {
  try {
    const response = await api.get<GetListResponse<Booking>>(
      "/bookings/client",
      {
        params,
      }
    );
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
    const response = await api.post<SuccessResponse<Booking>>(
      "/bookings/client",
      booking
    );
    return response.data;
  } catch (error) {
    console.error("Create Booking API error:", error);
  }
};

export const createPayment = async (form: { bookingId: string }) => {
  try {
    const response = await api.post("/bookings/payments", form);
    return response.data;
  } catch (error) {
    console.log("Create Payment API error:", error);
  }
};
