const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Admin panel" });
});

module.exports = router;
