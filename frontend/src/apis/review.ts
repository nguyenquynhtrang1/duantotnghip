import { GetListResponse } from "../types/common";
import { GetListParamsReview, Review, ReviewForm } from "../types/review";

import api from "./config";

export const getReviews = async (
  params: GetListParamsReview
): Promise<GetListResponse<Review>> => {
  try {
    const response = await api.get<GetListResponse<Review>>("/reviews/client", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get room types API error:", error);
    throw new Error("Failed to get room types.");
  }
};

export const createReview = async (review: ReviewForm) => {
  try {
    const response = await api.post<Review>("/reviews", review);
    return response.data;
  } catch (error) {
    console.error("Create review API error:", error);
    throw new Error("Failed to create review.");
  }
};
