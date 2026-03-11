import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/login/LoginPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { MembersPage } from "@/pages/members/MembersPage";
import { MemberDetailPage } from "@/pages/members/MemberDetailPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:memberId" element={<MemberDetailPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
