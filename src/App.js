import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques accessibles seulement si NON connecté */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/inscription" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/connexion" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsList /></ProtectedRoute>} />
          <Route path="/graphs" element={<ProtectedRoute><TransactionsCharts /></ProtectedRoute>} />

          {/* Routes privées accessibles seulement si connecté */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;