import { useState, useEffect } from "react";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [bookId]);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getBookReviews(bookId);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      setError("Nie udało się załadować recenzji");
      setLoading(false);
    }
  };

  if (loading) return <div>Ładowanie recenzji...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Recenzje</h2>
      {user && (
        <Link
          to={`/books/${bookId}/review/new`}
          className="mb-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Dodaj recenzję
        </Link>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-lg p-4 bg-white shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{review.user.username}</div>
                <div className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              {user && user.userId === review.user._id && (
                <div className="space-x-2">
                  <Link
                    to={`/books/${bookId}/review/edit/${review._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edytuj
                  </Link>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Usuń
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
