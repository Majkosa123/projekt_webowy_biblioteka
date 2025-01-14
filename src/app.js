const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bookRoutes = require("./routes/books");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Połączono z MongoDB Atlas"))
  .catch((err) => console.error("Błąd połączenia z MongoDB:", err));

app.get("/", (req, res) => {
  res.json({ message: "Witaj w API Interaktywnej Biblioteki" });
});

app.use("/api/books", bookRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Wystąpił błąd serwera!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
