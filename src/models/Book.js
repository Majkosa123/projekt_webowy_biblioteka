const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  available: {
    type: Number,
    min: 0,
    default: 1,
  },
  status: {
    type: String,
    enum: ["dostępna", "wypożyczona", "zarezerwowana", "w naprawie"],
    default: "dostępna",
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
