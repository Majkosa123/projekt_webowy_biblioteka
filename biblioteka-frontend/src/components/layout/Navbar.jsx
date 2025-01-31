import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-indigo-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              BookSphere
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Strona główna
            </Link>
            <Link
              to="/books"
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Książki
            </Link>
            {user && (
              <Link
                to="/chat"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Czat
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Wyloguj
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Zaloguj
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-700 text-white hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Zarejestruj
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
