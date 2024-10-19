import { GetListParams } from "./common";
import { Room } from "./room";
import { User } from "./user";

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
}

export interface Booking {
  _id: string;
  room: Room;
  user: User;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status: BookingStatus;
}

export interface BookingForm {
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status?: BookingStatus;
}

export interface BookingStatusForm {
  status: BookingStatus;
}

export type GetListParamsBooking = GetListParams<{
  status?: BookingStatus;
}>;

export type GetRevenue = {
  from: Date;
  to: Date;
};
