import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  UsersIcon,
  StarIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Sekcja główna */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Witaj w BookSphere
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Twoja interaktywna biblioteka online. Odkrywaj, wypożyczaj i dziel się
          opiniami o książkach w czasie rzeczywistym.
        </p>
      </div>

      {/* Funkcjonalności */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <BookOpenIcon className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Bogaty Katalog</h3>
          <p className="text-gray-600">
            Przeglądaj naszą różnorodną kolekcję książek z wielu kategorii i
            gatunków.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <StarIcon className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">System Recenzji</h3>
          <p className="text-gray-600">
            Dziel się swoimi opiniami i czytaj recenzje innych czytelników.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <MessageCircleIcon className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Czat na Żywo</h3>
          <p className="text-gray-600">
            Kontaktuj się z administracją biblioteki w czasie rzeczywistym.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <UsersIcon className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Powiadomienia</h3>
          <p className="text-gray-600">
            Otrzymuj natychmiastowe powiadomienia o dostępności książek.
          </p>
        </div>
      </div>

      {/* Sekcja CTA */}
      <div className="bg-indigo-600 text-white rounded-lg p-8 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          {user ? "Przeglądaj naszą kolekcję" : "Dołącz do BookSphere"}
        </h2>
        <p className="text-lg mb-6">
          {user
            ? "Zobacz nasze najnowsze książki i podziel się swoją opinią."
            : "Zarejestruj się, aby uzyskać dostęp do wszystkich funkcji biblioteki."}
        </p>
        {!user ? (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Zarejestruj się
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Zaloguj się
            </Link>
          </div>
        ) : (
          <Link
            to="/books"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Przeglądaj katalog
          </Link>
        )}
      </div>

      {/* Informacje o systemie */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          O naszym systemie
        </h2>
        <p className="text-gray-600 mb-4">
          BookSphere to nowoczesna platforma biblioteczna, która łączy
          tradycyjne wypożyczanie książek z funkcjami interaktywnymi. Nasza
          aplikacja wykorzystuje technologie czasu rzeczywistego, aby zapewnić
          użytkownikom najlepsze doświadczenia podczas korzystania z biblioteki.
        </p>
        <p className="text-gray-600">
          System oferuje nie tylko możliwość przeglądania i wypożyczania
          książek, ale także funkcje społecznościowe - możesz dzielić się
          opiniami, otrzymywać powiadomienia o dostępności książek i komunikować
          się z administracją poprzez wbudowany czat.
        </p>
      </div>
    </div>
  );
};

export default Home;
