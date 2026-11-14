import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/signup" replace />}
      />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/login" element={<Login />} />

      <Route path="/verification" element={<Verification />} />

      <Route
        path="*"
        element={<Navigate to="/signup" replace />}
      />
    </Routes>
  );
}

export default App;
