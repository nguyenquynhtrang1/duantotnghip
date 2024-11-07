"// use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { FaEdit, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../apis/auth";
import { createPayment, getBookings } from "../apis/booking";
import { createReview } from "../apis/review";
import { getProfile } from "../apis/user";
import BackDrop from "../components/BackDrop/BackDrop";
import Chart from "../components/Chart/Chart";
import RatingModal from "../components/RatingModal/RatingModal";
import Table from "../components/Table/Table";
import { Booking } from "../types/booking";
import { ReviewForm } from "../types/review";
import ProfileModal from "../components/ProfileModal/ProfileModal";

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentNav, setCurrentNav] = useState<
    "bookings" | "amount" | "ratings"
  >("bookings");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [ratingText, setRatingText] = useState("");

  const { data: bookings } = useQuery({
    queryKey: ["userBooking"],
    queryFn: () => getBookings({ limit: 0 }),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { mutate: payment } = useMutation({
    mutationFn: (form: { bookingId: string }) => createPayment(form),
  });

  const { mutate: review } = useMutation({
    mutationFn: (form: ReviewForm) => createReview(form),
  });

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.removeQueries({
        queryKey: ["profile"],
      });
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const toggleRatingModal = () => setIsRatingVisible((prevState) => !prevState);
  const toggleProfileModal = () =>
    setIsProfileVisible((prevState) => !prevState);

  const reviewSubmitHandler = async (): Promise<string | undefined> => {
    if (!ratingText.trim().length || !ratingValue) {
      toast.error("Please provide a rating text and a rating");
      return;
    }

    if (!roomId) toast.error("Id not provided");
    setIsSubmittingReview(true);

    review(
      {
        roomId: roomId as string,
        rating: ratingValue,
        comment: ratingText,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["roomReviews", roomId],
          });
          toast.success("Review Submitted");
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setRatingText("");
          setRatingValue(null);
          setRoomId(null);
          setIsSubmittingReview(false);
          setIsRatingVisible(false);
        },
      }
    );
  };

  const onAction = async (booking: Booking) => {
    if (booking.status === "Pending") {
      payment(
        { bookingId: booking._id },
        {
          onSuccess: (data) => {
            window.location.href = data.data.payUrl;
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } else {
      setRoomId(booking.room._id);
      toggleRatingModal();
      toast.info("You have already rated this room");
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py10">
      <div className="md:col-span-8 lg:col-span-9">
        <div className="flex items-center gap-4">
          <h5 className="text-2xl font-bold">
            Hello, {profile?.data.username}
          </h5>
          <FaEdit
            className="text-2xl cursor-pointer"
            onClick={toggleProfileModal}
          />
        </div>
        <div className="md:hidden w-14 h-14 rounded-l-full overflow-hidden">
          <FaUserCircle className="cursor-pointer" />
        </div>
        <p className="text-xs py-2 font-medium">
          Joined In {profile?.data.createdAt.toString().split("T")[0]}
        </p>
        <div
          className="flex items-center gap-2 w-max"
          role="button"
          onClick={() => mutate()}
        >
          <FaSignOutAlt className="text-2xl cursor-pointer" />
          <h5 className="text-xl">Logout</h5>
        </div>
        <div className="md:hidden flex items-center my-2">
          <p className="mr-2">Sign out</p>
          <FaSignOutAlt
            className="text-3xl cursor-pointer"
            onClick={() => mutate()}
          />
        </div>

        <nav className="sticky top-0 px-2 w-fit mx-auto md:w-full md:px-5 py-3 mb-8 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-7">
          <ol
            className={`${
              currentNav === "bookings" ? "text-blue-600" : "text-gray-700"
            } inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}
          >
            <li
              onClick={() => setCurrentNav("bookings")}
              className="inline-flex items-center cursor-pointer"
            >
              <BsJournalBookmarkFill />
              <a className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                Current Bookings
              </a>
            </li>
          </ol>
          <ol
            className={`${
              currentNav === "amount" ? "text-blue-600" : "text-gray-700"
            } inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}
          >
            <li
              onClick={() => setCurrentNav("amount")}
              className="inline-flex items-center cursor-pointer"
            >
              <GiMoneyStack />
              <a className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                Amount Spent
              </a>
            </li>
          </ol>
        </nav>

        {currentNav === "bookings" ? (
          bookings?.data && (
            <Table bookingDetails={bookings.data} onAction={onAction} />
          )
        ) : (
          <></>
        )}
        {currentNav === "amount" ? (
          bookings?.data && (
            <Chart
              userBookings={bookings.data.filter(
                (i) => i.status === "Confirmed"
              )}
            />
          )
        ) : (
          <></>
        )}
      </div>

      <RatingModal
        isOpen={isRatingVisible}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        ratingText={ratingText}
        setRatingText={setRatingText}
        isSubmittingReview={isSubmittingReview}
        reviewSubmitHandler={reviewSubmitHandler}
        toggleRatingModal={toggleRatingModal}
      />
      <ProfileModal
        isOpen={isProfileVisible}
        toggleProfileModal={toggleProfileModal}
      />
      <BackDrop isOpen={isRatingVisible || isProfileVisible} />
    </div>
  );
};

export default Profile;
