import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/login/LoginPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { PostRegisterPage } from "@/pages/register/PostRegisterPage";
import { MembersPage } from "@/pages/members/MembersPage";
import { MemberDetailPage } from "@/pages/members/MemberDetailPage";
import { LinksPage } from "@/pages/links/LinksPage";
import { QrPage } from "@/pages/qr/QrPage";
import { ExpiredPage } from "@/pages/expired/ExpiredPage";
import { ApplyLayout } from "@/components/layout/ApplyLayout";
import { ApplyPage } from "@/pages/apply/ApplyPage";
import { ApplyStatusPage } from "@/pages/apply/ApplyStatusPage";
import { ApplicationsPage } from "@/pages/admin/ApplicationsPage";
import { RecruitmentPage } from "@/pages/admin/RecruitmentPage";
import { ConvertPage } from "@/pages/convert/ConvertPage";
import { ConvertStatusPage } from "@/pages/convert/ConvertStatusPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post-register" element={<PostRegisterPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:memberId" element={<MemberDetailPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/qr" element={<QrPage />} />
            <Route path="/admin/applications" element={<ApplicationsPage />} />
            <Route path="/admin/recruitment" element={<RecruitmentPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ApplyLayout />}>
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/apply/status" element={<ApplyStatusPage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/convert/status" element={<ConvertStatusPage />} />
          </Route>
        </Route>
        <Route path="/expired" element={<ExpiredPage />} />
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
