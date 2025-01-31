require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb+srv://ecommerce:ecommerce123@cluster0.crayt.mongodb.net/interaktywna_biblioteka";

    console.log("MONGODB_URI:", mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Połączono z MongoDB");

    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin już istnieje w bazie");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Administrator został utworzony pomyślnie!");
    console.log("Login: admin");
    console.log("Hasło: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Błąd podczas tworzenia admina:", error);
    process.exit(1);
  }
};

createAdmin();
