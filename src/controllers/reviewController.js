const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.user.userId,
    });
    await review.save();
    res.status(201).json({
      message: "Recenzja została dodana",
      review,
    });
  } catch (error) {
    res.status(400).json({
      message: "Nie udało się dodać recenzji",
      error: error.message,
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { bookId } = req.query;
    const filter = bookId ? { book: bookId } : {};

    const reviews = await Review.find(filter)
      .populate("user", "username")
      .populate("book", "title");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się pobrać recenzji",
      error: error.message,
    });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "username")
      .populate("book", "title");
    if (!review) {
      return res.status(404).json({ message: "Nie znaleziono recenzji" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania recenzji",
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono recenzji lub brak uprawnień" });
    }
    res.json({
      message: "Recenzja została zaktualizowana",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się zaktualizować recenzji",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono recenzji lub brak uprawnień" });
    }
    res.json({
      message: "Recenzja została usunięta",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się usunąć recenzji",
      error: error.message,
    });
  }
};
