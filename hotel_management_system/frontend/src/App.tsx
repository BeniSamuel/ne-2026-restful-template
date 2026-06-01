import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Bookings from "./pages/Bookings";
import CreatePassword from "./pages/CreatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Hotels from "./pages/Hotels";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Signup from "./pages/Signup";
import VerifyCode from "./pages/VerifyCode";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Navigate to="/login" replace />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<ForgotPassword />} path="/forgot-password" />
        <Route element={<VerifyCode />} path="/verify-code" />
        <Route element={<CreatePassword />} path="/create-password" />
        <Route element={<ProtectedRoute><Home /></ProtectedRoute>} path="/dashboard" />
        <Route element={<ProtectedRoute><Hotels /></ProtectedRoute>} path="/hotels" />
        <Route element={<ProtectedRoute><Bookings /></ProtectedRoute>} path="/bookings" />
        <Route element={<ProtectedRoute><Profile /></ProtectedRoute>} path="/profile" />
        <Route element={<ProtectedRoute role="ADMIN"><Reports /></ProtectedRoute>} path="/reports" />
        <Route element={<Navigate to="/login" replace />} path="*" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
