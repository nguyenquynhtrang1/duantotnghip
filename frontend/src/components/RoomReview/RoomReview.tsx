import { FC, useState } from "react";
import Rating from "../Rating/Rating";
import { getReviews } from "../../apis/review";
import { useQuery } from "@tanstack/react-query";
import { GetListParamsReview } from "../../types/review";

const RoomReview: FC<{ roomId: string }> = ({ roomId }) => {
  const [params] = useState<GetListParamsReview>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
    roomId,
  });
  const {
    data: roomReviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roomReviews", roomId, JSON.stringify(params)],
    queryFn: () => getReviews(params),
  });

  if (error) throw new Error("Cannot fetch data");
  if (typeof roomReviews === "undefined" && !isLoading)
    throw new Error("Cannot fetch data");

  console.log(roomReviews);

  return (
    <>
      {roomReviews &&
        roomReviews.data.map((review) => (
          <div
            className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg"
            key={review._id}
          >
            <div className="font-semibold mb-2 flex">
              <p>{review.user.email}</p>
              <div className="ml-4 flex items-center text-tertiary-light text-lg">
                <Rating rating={review.rating} />
              </div>
            </div>

            <p>{review.comment}</p>
          </div>
        ))}
    </>
  );
};

export default RoomReview;
