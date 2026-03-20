import type React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Users, Link, QrCode, LogOut, User, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useMe } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/members", icon: Users, label: "멤버 관리", end: true },
  { to: "/links", icon: Link, label: "URL 단축" },
  { to: "/qr", icon: QrCode, label: "QR 코드" },
];

function SidebarNavLink({ to, icon: Icon, label, end }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50",
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const logout = useLogout();
  const me = useMe();
  const navigate = useNavigate();
  const member = me.data?.member;

  return (
    <aside className="flex h-svh w-60 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 font-semibold">
        BCSD
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink key={item.to} {...item} />
        ))}
      </nav>
      <Separator />
      <div className="flex items-center gap-2 p-3">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
            {member?.name?.charAt(0) ?? me.data?.email?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 leading-tight">
          <span className="truncate text-sm font-medium">{member?.name ?? "..."}</span>
          <span className="truncate text-xs text-muted-foreground">{me.data?.email ?? ""}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1 hover:bg-accent/50">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-48">
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
