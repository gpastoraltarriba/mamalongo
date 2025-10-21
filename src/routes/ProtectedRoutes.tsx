import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthGate";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
