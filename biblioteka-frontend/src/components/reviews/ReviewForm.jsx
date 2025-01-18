import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reviewService } from "../../services/reviewService";

const ReviewForm = () => {
  const { bookId, reviewId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    book: bookId,
  });
  const [error, setError] = useState("");
  const isEditing = Boolean(reviewId);

  useEffect(() => {
    if (isEditing) {
      const fetchReview = async () => {
        try {
          const response = await reviewService.getReviewById(reviewId);
          setFormData({
            rating: response.data.rating,
            comment: response.data.comment,
            book: response.data.book._id,
          });
        } catch (error) {
          setError("Nie udało się pobrać recenzji");
        }
      };
      fetchReview();
    }
  }, [reviewId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await reviewService.updateReview(reviewId, formData);
      } else {
        await reviewService.createReview(formData);
      }
      navigate(`/books/${bookId}`);
    } catch (error) {
      setError(
        `Nie udało się ${isEditing ? "zaktualizować" : "dodać"} recenzji: ` +
          error.response?.data?.message || "Wystąpił błąd"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edytuj recenzję" : "Dodaj recenzję"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ocena
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="5">5 gwiazdek</option>
            <option value="4">4 gwiazdki</option>
            <option value="3">3 gwiazdki</option>
            <option value="2">2 gwiazdki</option>
            <option value="1">1 gwiazdka</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Komentarz
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Napisz swoją opinię..."
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/books/${bookId}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditing ? "Zapisz zmiany" : "Dodaj recenzję"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
