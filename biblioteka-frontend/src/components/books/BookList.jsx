import { useState, useEffect } from "react";
import { bookService } from "../../services/bookService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Nie udało się pobrać książek");
      setLoading(false);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.deleteBook(bookToDelete._id);
      setBooks(books.filter((book) => book._id !== bookToDelete._id));
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (error) {
      setError("Nie udało się usunąć książki");
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Katalog książek</h1>
        {user && (
          <Link
            to="/books/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Dodaj książkę
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg shadow-lg p-6 bg-white"
          >
            <h2 className="text-xl font-bold mb-2">
              <Link to={`/books/${book._id}`} className="hover:text-indigo-600">
                {book.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-2">Autor: {book.author}</p>
            <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-600 mb-2">Kategoria: {book.category}</p>
            <p className="text-gray-600 mb-4">{book.description}</p>
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  book.status === "dostępna"
                    ? "bg-green-100 text-green-800"
                    : book.status === "wypożyczona"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {book.status}
              </span>
              {user && (
                <div className="space-x-2">
                  <Link
                    to={`/books/edit/${book._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edytuj
                  </Link>
                  <Link
                    to={`/books/${book._id}/review/new`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Dodaj recenzję
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(book)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Usuń
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">
              Potwierdzenie usunięcia
            </h3>
            <p>Czy na pewno chcesz usunąć książkę "{bookToDelete?.title}"?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default BookList;
