import { Outlet } from "react-router-dom";

export function ApplyLayout() {
  return (
    <div className="flex min-h-svh items-start justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <Outlet />
      </div>
    </div>
  );
}
