"// use client";

import { FC } from "react";
import { Booking } from "../../types/booking";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { convertToVND } from "../../libs";

type Props = {
  bookingDetails: Booking[];
  onAction?: (booking: Booking) => void;
};

const Table: FC<Props> = ({ bookingDetails, onAction }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Room name</th>
            <th className="px-6 py-3">Unit Price</th>
            <th className="px-6 py-3">ToTal Price</th>
            <th className="px-6 py-3">Discount</th>
            <th className="px-6 py-3">Check-in day</th>
            <th className="px-6 py-3">Check-out day</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((booking) => (
            <tr
              key={booking._id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <th
                onClick={() => navigate(`/rooms/${booking.room._id}`)}
                className="px-6 underline text-blue-600 cursor-pointer py-4 font-medium whitespace-nowrap"
              >
                {booking.room.name}
              </th>
              <td className="px-6 py-4">{convertToVND(booking.room.price)}</td>
              <td className="px-6 py-4">{convertToVND(booking.totalCost)}</td>
              <td className="px-6 py-4">{booking.room.discount}%</td>
              <td className="px-6 py-4">
                {dayjs(booking.checkIn).format("DD/MM/YYYY")}
              </td>
              <td className="px-6 py-4">
                {dayjs(booking.checkOut).format("DD/MM/YYYY")}
              </td>
              <td className="px-6 py-4">{booking.status}</td>
              <td className="px-6 py-4">
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => onAction && onAction(booking)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {booking.status === "Pending" ? "Pay" : "Rate"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
