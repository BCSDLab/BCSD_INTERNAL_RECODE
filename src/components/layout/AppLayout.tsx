import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
