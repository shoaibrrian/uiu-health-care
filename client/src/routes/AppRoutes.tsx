import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StudentDashboard from "../pages/student/StudentDashboard";
import FirstAid from "../pages/student/FirstAid";
import MentalHealth from "../pages/student/MentalHealth";
import HospitalFinder from "../pages/student/HospitalFinder";
import EmergencyHistory from "../pages/student/EmergencyHistory";
import Notifications from "../pages/student/Notifications";
import MedicalProfile from "../pages/student/MedicalProfile";
import HealthAwareness from "../pages/student/HealthAwareness";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminSosHistory from "../pages/admin/AdminSosHistory";
import AdminContent from "../pages/admin/AdminContent";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/first-aid"
          element={
            <ProtectedRoute role="student">
              <FirstAid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/mental-health"
          element={
            <ProtectedRoute role="student">
              <MentalHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/hospitals"
          element={
            <ProtectedRoute role="student">
              <HospitalFinder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute role="student">
              <EmergencyHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute role="student">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/medical-profile"
          element={
            <ProtectedRoute role="student">
              <MedicalProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/health-awareness"
          element={
            <ProtectedRoute role="student">
              <HealthAwareness />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sos-history"
          element={
            <ProtectedRoute role="admin">
              <AdminSosHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute role="admin">
              <AdminContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
