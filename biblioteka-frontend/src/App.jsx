import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
