import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";

export function ProtectedRoute() {
  const { isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (isError) return <Navigate to="/login" replace />;

  return <Outlet />;
}
