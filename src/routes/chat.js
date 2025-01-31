const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticate } = require("../middleware/auth");

router.post("/messages", authenticate, chatController.sendMessage);
router.get("/messages", authenticate, chatController.getChatHistory);
router.get("/admin-id", authenticate, chatController.getAdminId);

module.exports = router;
