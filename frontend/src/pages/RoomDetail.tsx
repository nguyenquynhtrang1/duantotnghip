/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  AiOutlineCoffee,
  AiOutlineMedicineBox,
  AiOutlineWifi,
} from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import { IoIosRestaurant } from "react-icons/io";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { MdOutlineCleaningServices, MdOutlinePool } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createBooking, createPayment } from "../apis/booking";
import { getRoom } from "../apis/room";
import BookRoomCta from "../components/BookRoomCta/BookRoomCta";
import HotelPhotoGallery from "../components/HotelPhotoGallery/HotelPhotoGallery";
import LoadingSpinner from "../components/Loader/Loader";
import { BookingForm } from "../types/booking";
import RoomReview from "../components/RoomReview/RoomReview";

const OFFERED_AMENITIES = [
  { label: "Free Wifi", icon: (props: any) => <AiOutlineWifi {...props} /> },
  {
    label: "Breakfast Included",
    icon: (props: any) => <AiOutlineCoffee {...props} />,
  },
  {
    label: "Swimming Pool",
    icon: (props: any) => <MdOutlinePool {...props} />,
  },
  { label: "Restaurant", icon: (props: any) => <IoIosRestaurant {...props} /> },
];

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["getRoom", id],
    queryFn: () => getRoom(id as string),
  });

  const { mutate: booking } = useMutation({
    mutationFn: (form: BookingForm) => createBooking(form),
  });
  const { mutate: payment } = useMutation({
    mutationFn: (form: { bookingId: string }) => createPayment(form),
  });

  const handleBookNowClick = async () => {
    if (!checkinDate || !checkoutDate)
      return toast.error("Please provide checkin / checkout date");

    if (checkinDate > checkoutDate)
      return toast.error("Please choose a valid checkin period");

    booking(
      {
        roomId: id as string,
        checkIn: checkinDate,
        checkOut: checkoutDate,
      },
      {
        onSuccess: async (data) => {
          payment(
            { bookingId: data?.data._id as string },
            {
              onSuccess: (data) => {
                window.location.href = data.data.payUrl;
              },
              onError: (error) => {
                toast.error(error.message);
              },
            }
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return isLoading || !data ? (
    <LoadingSpinner />
  ) : (
    <div>
      <HotelPhotoGallery photos={data.data.photos} />
      <div className="container mx-auto mt-20">
        <div className="md:grid md:grid-cols-12 gap-10 px-3">
          <div className="md:col-span-8 md:w-full">
            <div>
              <h2 className="font-bold text-left text-lg md:text-2xl">
                {data.data.name}
              </h2>
              <div className="flex my-11">
                {OFFERED_AMENITIES.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="md:w-44 w-fit px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center"
                  >
                    {amenity.icon({ size: 30 })}
                    <p className="text-xs md:text-base pt-3">{amenity.label}</p>
                  </div>
                ))}
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Description</h2>
                <p>{data.data.description}</p>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Offered Amenities</h2>
                <div className="grid grid-cols-2">
                  {OFFERED_AMENITIES.map((amenity) => (
                    <div
                      key={amenity.label}
                      className="flex items-center md:my-0 my-1"
                    >
                      {amenity.icon({})}
                      <p className="text-xs md:text-base ml-2">
                        {amenity.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Safety And Hygiene</h2>
                <div className="grid grid-cols-2">
                  <div className="flex items-center my-1 md:my-0">
                    <MdOutlineCleaningServices />
                    <p className="ml-2 md:text-base text-xs">Daily Cleaning</p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <LiaFireExtinguisherSolid />
                    <p className="ml-2 md:text-base text-xs">
                      Fire Extinguishers
                    </p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <AiOutlineMedicineBox />
                    <p className="ml-2 md:text-base text-xs">
                      Disinfections and Sterilizations
                    </p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <GiSmokeBomb />
                    <p className="ml-2 md:text-base text-xs">Smoke Detectors</p>
                  </div>
                </div>
              </div>

              <div className="shadow dark:shadow-white rounded-lg p-6">
                <div className="items-center mb-4">
                  <p className="md:text-lg font-semibold">Customer Reviews</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RoomReview roomId={id as string} />
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
            <BookRoomCta
              excludeDates={data.data.invalidDates}
              discount={data.data.discount}
              price={data.data.price}
              checkinDate={checkinDate}
              setCheckinDate={setCheckinDate}
              checkoutDate={checkoutDate}
              setCheckoutDate={setCheckoutDate}
              handleBookNowClick={handleBookNowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
