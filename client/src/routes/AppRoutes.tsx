import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StudentDashboard from "../pages/student/StudentDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={<StudentDashboard />} />

        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </BrowserRouter>
  );
}
