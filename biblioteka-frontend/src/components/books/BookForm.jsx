import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../../services/bookService";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    quantity: 1,
    status: "dostępna",
  });
  const [error, setError] = useState("");
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchBook = async () => {
        try {
          const response = await bookService.getBookById(id);
          setFormData(response.data);
        } catch (error) {
          setError("Nie udało się pobrać danych książki");
          console.error("Błąd pobierania książki:", error);
        }
      };
      fetchBook();
    }
  }, [id]);

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
        await bookService.updateBook(id, formData);
      } else {
        await bookService.createBook(formData);
      }
      navigate("/books");
    } catch (error) {
      setError(
        `Nie udało się ${isEditing ? "zaktualizować" : "dodać"} książki: ` +
          error.response?.data?.message || "Wystąpił błąd"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edytuj książkę" : "Dodaj nową książkę"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tytuł
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Autor
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opis
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="dostępna">Dostępna</option>
            <option value="wypożyczona">Wypożyczona</option>
            <option value="zarezerwowana">Zarezerwowana</option>
            <option value="w naprawie">W naprawie</option>
          </select>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditing ? "Zapisz zmiany" : "Dodaj książkę"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
