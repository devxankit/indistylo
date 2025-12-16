import { create } from "zustand";

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  likes: number;
  dislikes: number;
  response?: string;
  status: "published" | "pending" | "archived";
}

interface ReviewState {
  reviews: Review[];
  addResponse: (reviewId: string, response: string) => void;
  updateResponse: (reviewId: string, response: string) => void;
  deleteResponse: (reviewId: string) => void;
  updateReviewStatus: (reviewId: string, status: Review["status"]) => void;
  getReview: (reviewId: string) => Review | undefined;
}

// Initial mock reviews data
const initialReviews: Review[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "Rajesh Kumar",
    rating: 5,
    comment: "Excellent service! The stylist understood exactly what I wanted. Will definitely come back.",
    date: "2024-01-15",
    service: "Haircut & Styling",
    likes: 12,
    dislikes: 0,
    status: "published",
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Priya Sharma",
    rating: 4,
    comment: "Good experience overall. The color turned out great but took a bit longer than expected.",
    date: "2024-01-12",
    service: "Hair Color & Treatment",
    likes: 8,
    dislikes: 1,
    status: "published",
  },
  {
    id: "3",
    customerId: "3",
    customerName: "Amit Singh",
    rating: 5,
    comment: "Best beard trim I've ever had! The attention to detail is impressive.",
    date: "2024-01-10",
    service: "Beard Trim",
    likes: 15,
    dislikes: 0,
    status: "published",
    response: "Thank you for your kind words, Amit! We're glad you enjoyed our service. Looking forward to seeing you again soon!",
  },
  {
    id: "4",
    customerId: "4",
    customerName: "Sneha Patel",
    rating: 5,
    comment: "Absolutely loved my facial! My skin feels so refreshed and glowing.",
    date: "2024-01-08",
    service: "Facial Treatment",
    likes: 9,
    dislikes: 0,
    status: "published",
  },
  {
    id: "5",
    customerId: "5",
    customerName: "Vikram Mehta",
    rating: 3,
    comment: "Service was okay but felt rushed. Expected better for the price point.",
    date: "2023-12-28",
    service: "Haircut",
    likes: 3,
    dislikes: 5,
    status: "published",
    response: "We apologize for your experience, Vikram. We'd like to offer you a complimentary service to make it right. Please contact us to schedule.",
  },
  {
    id: "6",
    customerId: "6",
    customerName: "Anjali Desai",
    rating: 5,
    comment: "Outstanding service as always! This is my go-to salon for all beauty needs.",
    date: "2024-01-14",
    service: "Hair Spa",
    likes: 20,
    dislikes: 0,
    status: "published",
  },
];

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: initialReviews,

  addResponse: (reviewId, response) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, response } : review
      ),
    }));
  },

  updateResponse: (reviewId, response) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, response } : review
      ),
    }));
  },

  deleteResponse: (reviewId) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, response: undefined } : review
      ),
    }));
  },

  updateReviewStatus: (reviewId, status) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      ),
    }));
  },

  getReview: (reviewId) => {
    return get().reviews.find((review) => review.id === reviewId);
  },
}));

