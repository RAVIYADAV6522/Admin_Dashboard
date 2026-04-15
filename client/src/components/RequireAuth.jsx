import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const requireAuthEnv = () => import.meta.env.VITE_REQUIRE_AUTH !== "false";

export function RequireAuth() {
  const token = useSelector((s) => s.global.token);
  if (!requireAuthEnv()) return <Outlet />;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function LoginGate({ children }) {
  const token = useSelector((s) => s.global.token);
  if (requireAuthEnv() && token) return <Navigate to="/dashboard" replace />;
  return children;
}
