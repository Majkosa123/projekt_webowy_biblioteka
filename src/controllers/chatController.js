const Message = require("../models/Message");
const User = require("../models/User");
const fs = require("fs").promises;
const path = require("path");

let io = null;

exports.setIO = (socketIo) => {
  io = socketIo;
};

// katalog logów
const ensureLogDirectory = async () => {
  const logDir = path.join(__dirname, "../logs");
  try {
    await fs.mkdir(logDir, { recursive: true });
  } catch (error) {
    console.error("Błąd podczas tworzenia katalogu logów:", error);
  }
};

async function logChatActivity(activity) {
  await ensureLogDirectory();
  const logPath = path.join(__dirname, "../logs/chat.log");
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${activity}\n`;

  try {
    await fs.appendFile(logPath, logEntry);
  } catch (error) {
    console.error("Błąd podczas zapisywania logu czatu:", error);
  }
}

exports.getAdminId = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Nie znaleziono administratora" });
    }
    res.json({ adminId: admin._id });
  } catch (error) {
    console.error("Błąd podczas pobierania ID admina:", error);
    res.status(500).json({
      message: "Nie udało się pobrać ID admina",
      error: error.message,
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username")
      .populate("receiver", "username");

    // wiadomość przez WebSocket
    if (io) {
      io.emit("new_message", {
        type: "NEW_MESSAGE",
        message: populatedMessage,
      });
    }

    await logChatActivity(
      `Użytkownik ${senderId} wysłał wiadomość do ${receiverId}`
    );

    res.status(201).json({
      message: "Wiadomość została wysłana",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Błąd podczas wysyłania wiadomości:", error);
    res.status(500).json({
      message: "Nie udało się wysłać wiadomości",
      error: error.message,
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ sentAt: -1 })
      .populate("sender", "username")
      .populate("receiver", "username");

    const total = await Message.countDocuments();

    res.json({
      messages,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się pobrać historii czatu",
      error: error.message,
    });
  }
};
