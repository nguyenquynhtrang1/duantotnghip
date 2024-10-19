import { GetListResponse } from "../types/common";
import { GetListParamsReview, Review } from "../types/review";

import api from "./config";

export const getReviews = async (
  params: GetListParamsReview
): Promise<GetListResponse<Review>> => {
  try {
    const response = await api.get<GetListResponse<Review>>("/Reviews", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get room types API error:", error);
    throw new Error("Failed to get room types.");
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await api.delete(`/Reviews/${id}`);
  } catch (error) {
    console.error("Delete room type API error:", error);
    throw new Error("Failed to delete room type.");
  }
};
