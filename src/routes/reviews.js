const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.js");
const reviewController = require("../controllers/reviewController");

router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", authenticate, reviewController.createReview);
router.put("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

module.exports = router;
