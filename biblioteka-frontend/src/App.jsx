import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import BookList from "./components/books/BookList";
import BookForm from "./components/books/BookForm";
import ReviewForm from "./components/reviews/ReviewForm";
import BookDetails from "./components/books/BookDetails";

// Tymczasowy komponent Home
const Home = () => <div>Witaj w BookSphere</div>;

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/edit/:id" element={<BookForm />} />
            <Route path="/books/:bookId/review/new" element={<ReviewForm />} />
            <Route
              path="/books/:bookId/review/edit/:reviewId"
              element={<ReviewForm />}
            />
            <Route path="/books/:id" element={<BookDetails />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
