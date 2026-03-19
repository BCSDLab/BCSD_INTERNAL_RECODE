import { NavLink, useNavigate } from "react-router-dom";
import { Users, Link, QrCode, LogOut, User, ChevronsUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLogout, useMe } from "@/hooks/use-auth";
import { useMember } from "@/hooks/use-members";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const logout = useLogout();
  const me = useMe();
  const member = useMember(me.data?.id ?? "");
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
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-accent/50 data-[popup-open]:bg-accent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                {member.data?.name?.charAt(0) ?? me.data?.email?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 leading-tight">
              <span className="truncate font-medium">
                {member.data?.name ?? "..."}
                {member.data?.track && <span className="font-normal text-muted-foreground"> · {member.data.track}</span>}
              </span>
              <span className="truncate text-xs text-muted-foreground">{member.data?.status ?? ""}</span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 rounded-lg">
            <div className="px-2 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                    {member.data?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-medium">{member.data?.name ?? "..."}</span>
                  <span className="truncate text-xs text-muted-foreground">{me.data?.email ?? ""}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <Badge variant="outline" className="text-xs">{member.data?.track ?? ""}</Badge>
                <Badge variant="secondary" className="text-xs">{member.data?.status ?? ""}</Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
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
