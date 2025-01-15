const Book = require("../models/Book");
let io = null;

exports.setIO = (socketIo) => {
  io = socketIo;
  console.log("Socket.IO zostało ustawione w kontrolerze książek");
};

exports.createBook = async (req, res) => {
  try {
    console.log("Otrzymane dane:", req.body);
    const book = new Book(req.body);
    await book.save();

    if (io) {
      console.log("Wysyłanie powiadomienia o nowej książce...");
      io.emit("42", [
        "book_notification",
        {
          type: "CREATE",
          message: `Dodano nową książkę: ${book.title}`,
          book: book,
        },
      ]);
      console.log("Powiadomienie wysłane");
    } else {
      console.log("UWAGA: Socket.IO nie jest dostępne w kontrolerze");
    }

    res.status(201).json({
      message: "Książka została dodana pomyślnie",
      book,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania książki:", error);
    res.status(400).json({
      message: "Nie udało się dodać książki",
      error: error.message,
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się pobrać książek",
      error: error.message,
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        message: "Nie znaleziono książki",
      });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania książki",
      error: error.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: "Nie znaleziono książki" });
    }

    if (io) {
      io.emit("42", [
        "book_notification",
        {
          type: "UPDATE",
          message: `Zaktualizowano książkę: ${book.title}`,
          book: book,
        },
      ]);
    }

    res.json({
      message: "Książka została zaktualizowana",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się zaktualizować książki",
      error: error.message,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Nie znaleziono książki" });
    }

    if (io) {
      io.emit("42", [
        "book_notification",
        {
          type: "DELETE",
          message: `Usunięto książkę: ${book.title}`,
          book: book,
        },
      ]);
    }

    res.json({
      message: "Książka została usunięta",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się usunąć książki",
      error: error.message,
    });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const searchPattern = req.query.q;
    const regex = new RegExp(searchPattern, "i");

    const books = await Book.find({
      $or: [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { category: regex },
      ],
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas wyszukiwania książek",
      error: error.message,
    });
  }
};
