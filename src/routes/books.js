const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:id", bookController.getBookById);

router.post(
  "/",
  authenticate,
  authorize("admin", "moderator"),
  bookController.createBook
);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "moderator"),
  bookController.updateBook
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  bookController.deleteBook
);

module.exports = router;
