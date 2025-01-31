const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { authenticate, authorize } = require("../middleware/auth");

//dostępne dla wszystkich
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:id", bookController.getBookById);

//dla admina
router.post("/", authenticate, authorize("admin"), bookController.createBook);
router.put("/:id", authenticate, authorize("admin"), bookController.updateBook);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  bookController.deleteBook
);

module.exports = router;
