import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role: "student" | "admin";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: { role?: string } | null = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  // Login nai
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Login ache kintu bhul role (jemon student /admin e jachche)
  if (user.role !== role) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />
    );
  }

  return <>{children}</>;
}
