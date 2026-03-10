import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMembers } from "@/hooks/use-members";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterOptions } from "@/hooks/use-tracks";
import type { MemberFilterParams } from "@/types/common";

const ALL_TRACK = "전체 트랙";
const ALL_STATUS = "전체 상태";
const ALL_PAYMENT = "전체 납부";
const PAGE_SIZE = 20;

function statusVariant(status: string) {
  switch (status) {
    case "Regular":
      return "default" as const;
    case "Beginner":
      return "secondary" as const;
    case "Mentor":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function paymentVariant(status: string) {
  switch (status) {
    case "Paid":
      return "default" as const;
    case "Unpaid":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export function MembersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const track = searchParams.get("track") ?? "";
  const status = searchParams.get("status") ?? "";
  const paymentStatus = searchParams.get("payment_status") ?? "";

  const [nameInput, setNameInput] = useState(searchParams.get("name") ?? "");
  const debouncedName = useDebounce(nameInput);

  const filter: MemberFilterParams = {
    page,
    size: PAGE_SIZE,
    ...(track && { track }),
    ...(status && { status }),
    ...(paymentStatus && { payment_status: paymentStatus }),
    ...(debouncedName && { name: debouncedName }),
  };

  const { data: filterOptions } = useFilterOptions();
  const { data, isLoading, isError } = useMembers(filter);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">멤버 관리</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 검색"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              updateParam("name", e.target.value);
            }}
            className="w-48 pl-8"
          />
        </div>

        <Select
          value={track || ALL_TRACK}
          onValueChange={(v) => updateParam("track", v === ALL_TRACK ? "" : v ?? "")}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL_TRACK}>전체 트랙</SelectItem>
            {filterOptions?.tracks.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status || ALL_STATUS}
          onValueChange={(v) => updateParam("status", v === ALL_STATUS ? "" : v ?? "")}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL_STATUS}>전체 상태</SelectItem>
            {filterOptions?.statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentStatus || ALL_PAYMENT}
          onValueChange={(v) =>
            updateParam("payment_status", v === ALL_PAYMENT ? "" : v ?? "")
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL_PAYMENT}>전체 납부</SelectItem>
            {filterOptions?.payment_statuses.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>멤버 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>트랙</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>팀</TableHead>
              <TableHead>납부</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.items.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/members/${member.id}`)}
                  >
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.track}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.team || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={paymentVariant(member.payment_status)}>
                        {member.payment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParam("page", String(page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateParam("page", String(page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
