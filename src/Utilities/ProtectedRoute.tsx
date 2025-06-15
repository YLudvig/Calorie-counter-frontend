import { Navigate } from "react-router-dom";
import type { User } from "../types/AuthTypes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: User | null;
}

export default function ProtectedRoute({ children, user }: ProtectedRouteProps) {

  if (!user) {
    // Redirect to login if there's no token
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
