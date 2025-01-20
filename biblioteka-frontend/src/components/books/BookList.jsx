import { useState, useEffect } from "react";
import { bookService } from "../../services/bookService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import _ from "lodash";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = "") => {
    try {
      setLoading(true);
      const response = query
        ? await bookService.searchBooks(query)
        : await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      setError("Nie udało się pobrać książek");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = _.debounce((query) => {
    fetchBooks(query);
  }, 500);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
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
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
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

        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj książek po tytule, autorze, ISBN lub kategorii..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
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
