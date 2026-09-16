import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StudentDashboard from "../pages/student/StudentDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import FirstAid from "../pages/student/FirstAid";
import MentalHealth from "../pages/student/MentalHealth";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={<StudentDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/student/first-aid" element={<FirstAid />} />

        <Route path="/student/mental-health" element={<MentalHealth />} />
      </Routes>
    </BrowserRouter>
  );
}
