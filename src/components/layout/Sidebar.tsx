import { NavLink, useNavigate } from "react-router-dom";
import { Users, Link, QrCode, LogOut, User, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useMe } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const logout = useLogout();
  const me = useMe();
  const navigate = useNavigate();

  return (
    <aside className="flex h-svh w-60 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 font-semibold">
        BCSD
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        <NavLink
          to="/members"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50",
            )
          }
        >
          <Users className="h-4 w-4" />
          멤버 관리
        </NavLink>
        <NavLink
          to="/links"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50",
            )
          }
        >
          <Link className="h-4 w-4" />
          URL 단축
        </NavLink>
        <NavLink
          to="/qr"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50",
            )
          }
        >
          <QrCode className="h-4 w-4" />
          QR 코드
        </NavLink>
      </nav>
      <Separator />
      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50">
            <User className="h-4 w-4" />
            <span className="flex-1 truncate text-left">
              {me.data?.email ?? "..."}
            </span>
            <ChevronUp className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate(`/members/${me.data?.id}`)}>
              <User className="mr-2 h-4 w-4" />
              내 프로필
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
