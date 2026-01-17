import { create } from "zustand";
import { api } from "../../user/services/apiClient";

export interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  service: string;
  response?: string;
  status: "published" | "pending" | "archived";
  likes?: number;
  dislikes?: number;
}

interface ReviewState {
  reviews: Review[];
  fetchReviews: () => Promise<void>;
  addResponse: (reviewId: string, response: string) => Promise<void>;
  updateResponse: (reviewId: string, response: string) => Promise<void>;
  deleteResponse: (reviewId: string) => Promise<void>;
  getReview: (reviewId: string) => Review | undefined;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],

  fetchReviews: async () => {
    try {
      const response: any = await api.get("/vendor/reviews");
      set({ reviews: response });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  },

  addResponse: async (reviewId, response) => {
    try {
      const updatedReview: any = await api.post(
        `/vendor/reviews/${reviewId}/reply`,
        { response }
      );
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === reviewId ? updatedReview : r
        ),
      }));
    } catch (error) {
      console.error("Failed to add response:", error);
      throw error;
    }
  },

  updateResponse: async (reviewId, response) => {
    try {
      const updatedReview: any = await api.post(
        `/vendor/reviews/${reviewId}/reply`,
        { response }
      );
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === reviewId ? updatedReview : r
        ),
      }));
    } catch (error) {
      console.error("Failed to update response:", error);
      throw error;
    }
  },

  deleteResponse: async (reviewId) => {
    try {
      const updatedReview: any = await api.post(
        `/vendor/reviews/${reviewId}/reply`,
        { response: "" }
      );
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === reviewId ? updatedReview : r
        ),
      }));
    } catch (error) {
      console.error("Failed to delete response:", error);
      throw error;
    }
  },

  getReview: (reviewId) => {
    return get().reviews.find((review) => review._id === reviewId);
  },
}));
