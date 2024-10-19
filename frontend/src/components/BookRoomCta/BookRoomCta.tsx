"// use client";

import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { convertToVND } from "../../libs";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/user";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  price: number;
  discount: number;
  handleBookNowClick: () => void;
  excludeDates: Date[];
};

const BookRoomCta: FC<Props> = (props) => {
  const {
    price,
    discount,
    checkinDate,
    setCheckinDate,
    checkoutDate,
    setCheckoutDate,
    handleBookNowClick,
    excludeDates,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const discountPrice = price - (price / 100) * discount;

  const calcNoOfDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    return noOfDays;
  };

  const onClick = () => {
    if (!profile) {
      navigate("/login", { state: { from: location.pathname } });
    } else {
      handleBookNowClick();
    }
  };

  return (
    <div className="px-7 py-6">
      <h3>
        <span
          className={`${discount ? "text-gray-400" : ""} font-bold text-xl`}
        >
          {convertToVND(price)}
        </span>
        {discount ? (
          <span className="font-bold text-xl">
            {" "}
            | discount {discount}%. Now{" "}
            <span className="text-tertiary-dark">
              {convertToVND(discountPrice)}
            </span>
          </span>
        ) : (
          ""
        )}
      </h3>

      <div className="w-full border-b-2 border-b-secondary my-2" />
      <h4 className="my-8">
        Check-in time is 14:00 PM, check-out time is 12:00 AM. If you leave
        behind any items, please contact the front desk.
      </h4>
      <div className="flex justify-center">
        <DatePicker
          selected={checkinDate}
          selectsRange
          selectsDisabledDaysInRange
          inline
          startDate={checkinDate ?? undefined}
          endDate={checkoutDate ?? undefined}
          onChange={(dates) => {
            if (dates instanceof Array) {
              setCheckinDate(dates[0]);
              setCheckoutDate(dates[1]);
            }
          }}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          excludeDates={excludeDates.map((date) => new Date(date))}
        />
      </div>
      {calcNoOfDays() > 0 ? (
        <p className="mt-3">
          Total Price: {convertToVND(calcNoOfDays() * discountPrice)}
        </p>
      ) : (
        <></>
      )}

      <button
        onClick={onClick}
        className="btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Book Now
      </button>
    </div>
  );
};

export default BookRoomCta;
