const Book = require("../models/Book");

// CREATE - Dodawanie nowej książki
exports.createBook = async (req, res) => {
  try {
    console.log("Otrzymane dane:", req.body);
    const book = new Book(req.body);
    await book.save();
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

// READ - Pobieranie wszystkich książek
exports.getAllBooks = async (req, res) => {
  try {
    console.log("Próba pobrania wszystkich książek...");
    const books = await Book.find();
    console.log("Znalezione książki:", books);
    res.json(books);
  } catch (error) {
    console.error("Błąd podczas pobierania książek:", error);
    res.status(500).json({
      message: "Nie udało się pobrać książek",
      error: error.message,
    });
  }
};

// READ - Pobieranie pojedynczej książki
exports.getBookById = async (req, res) => {
  try {
    console.log("Próba pobrania książki o ID:", req.params.id);
    const book = await Book.findById(req.params.id);
    console.log("Znaleziona książka:", book);

    if (!book) {
      console.log("Nie znaleziono książki");
      return res.status(404).json({
        success: false,
        message: "Nie znaleziono książki o podanym ID",
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania książki:", error);
    return res.status(500).json({
      success: false,
      message: "Nie udało się pobrać książki",
      error: error.message,
    });
  }
};

// UPDATE - Aktualizacja książki
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Nie znaleziono książki" });
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

// DELETE - Usuwanie książki
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Nie znaleziono książki" });
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

// SEARCH - Wyszukiwanie książek według wzorca
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
