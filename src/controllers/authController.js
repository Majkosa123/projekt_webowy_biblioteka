const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Użytkownik został zarejestrowany",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas rejestracji",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Nieprawidłowa nazwa użytkownika lub hasło",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Zalogowano pomyślnie",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas logowania",
      error: error.message,
    });
  }
};
