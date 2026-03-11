import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/hooks/use-auth";

export function ProtectedRoute() {
  const { isLoading, isError } = useMe();

  if (isLoading) return null;

  if (isError) return <Navigate to="/login" replace />;

  return <Outlet />;
}
