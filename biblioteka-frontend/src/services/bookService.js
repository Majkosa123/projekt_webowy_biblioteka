import api from "./api";

export const bookService = {
  getAllBooks: () => api.get("/books"),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post("/books", bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  searchBooks: (query) => api.get(`/books/search?q=${query}`),
};
