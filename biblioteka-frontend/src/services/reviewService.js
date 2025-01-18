import api from "./api";

export const reviewService = {
  getAllReviews: (bookId) => api.get(`/reviews?bookId=${bookId}`),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getBookReviews: (bookId) => api.get(`/reviews?book=${bookId}`),
};
