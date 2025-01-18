import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { bookService } from "../../services/bookService";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await bookService.getBookById(id);
        setBook(bookResponse.data);
        const reviewsResponse = await reviewService.getAllReviews(id);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Nie udało się pobrać danych książki");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;
  if (!book) return <div>Nie znaleziono książki</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <Link to="/books" className="text-indigo-600 hover:text-indigo-800">
            ← Powrót do listy
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2">Autor: {book.author}</p>
            <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-600 mb-2">Kategoria: {book.category}</p>
            <p className="text-gray-600 mb-4">{book.description}</p>
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
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recenzje</h2>
              {user && (
                <Link
                  to={`/books/${id}/review/new`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-block"
                >
                  Dodaj recenzję
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">
                  Ta książka nie ma jeszcze recenzji. Bądź pierwszy!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border rounded p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {review.user?.username}
                      </span>
                      <div>
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                        </span>
                        <span className="text-gray-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                    {user && user.userId === review.user?._id && (
                      <div className="mt-2 space-x-2 text-right">
                        <Link
                          to={`/books/${id}/review/edit/${review._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edytuj
                        </Link>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Usuń
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
