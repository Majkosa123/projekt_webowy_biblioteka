const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const reviewRoutes = require("./routes/reviews");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket"],
  connectTimeout: 45000,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const bookController = require("./controllers/bookController");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

bookController.setIO(io);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Połączono z MongoDB Atlas"))
  .catch((err) => console.error("Błąd połączenia z MongoDB:", err));

io.on("connection", (socket) => {
  console.log("Nowe połączenie WebSocket:", socket.id);

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("book_notification", (data) => {
    console.log("Otrzymano powiadomienie o książce:", data);
    io.emit("book_notification", data);
  });

  socket.emit("book_notification", {
    type: "CONNECTED",
    message: "Połączono z serwerem WebSocket",
  });

  socket.on("disconnect", (reason) => {
    console.log("Klient rozłączony:", socket.id, "Powód:", reason);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Witaj w API Interaktywnej Biblioteki" });
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Wystąpił błąd serwera!" });
});

process.on("SIGTERM", () => {
  console.log("Otrzymano SIGTERM. Zamykanie serwera...");
  server.close(() => {
    console.log("Serwer zamknięty");
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
const startServer = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${PORT} jest zajęty, próbuję port ${PORT + 1}`);
      server.listen(PORT + 1);
    } else {
      console.error("Błąd podczas uruchamiania serwera:", error);
    }
  }
};

startServer();
