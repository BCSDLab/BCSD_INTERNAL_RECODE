import { useState } from "react";
import { useSearchParamState } from "@/hooks/use-search-param-state";
import { MemberSheet } from "@/components/common/MemberSheet";
import { FilterSelect } from "@/components/common/FilterSelect";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { Search } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { useMembersWithFilters } from "@/hooks/use-members";
import { useDebounce } from "@/hooks/use-debounce";
import { statusVariant, paymentVariant } from "@/lib/format";
import type { MemberFilterInput } from "@/types/common";

const PAGE_SIZE = 20;

export function MembersPage() {
  const { searchParams, page, updateParam, setParam, deleteParam } = useSearchParamState();
  const selectedMemberId = searchParams.get("member");

  const track = searchParams.get("track") ?? "";
  const status = searchParams.get("status") ?? "";
  const paymentStatus = searchParams.get("payment_status") ?? "";

  const [nameInput, setNameInput] = useState(searchParams.get("name") ?? "");
  const debouncedName = useDebounce(nameInput);

  const filter: MemberFilterInput = {
    page,
    size: PAGE_SIZE,
    ...(track && { track }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(debouncedName && { name: debouncedName }),
  };

  const { data: result, isLoading, isError } = useMembersWithFilters(filter);
  const data = result?.members;
  const filterOptions = result?.memberFilters;


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

        <FilterSelect value={track} allLabel="전체 트랙" options={filterOptions?.tracks.map(t => ({ value: t, label: t }))} onValueChange={(v) => updateParam("track", v)} />
        <FilterSelect value={status} allLabel="전체 상태" options={filterOptions?.statuses.map(s => ({ value: s, label: s }))} onValueChange={(v) => updateParam("status", v)} />
        <FilterSelect value={paymentStatus} allLabel="전체 납부" options={filterOptions?.paymentStatuses.map(p => ({ value: p, label: p }))} onValueChange={(v) => updateParam("payment_status", v)} />
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
              <TableHead>납부</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? <TableSkeleton columns={5} />
              : data?.items.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer"
                    onClick={() => setParam("member", member.id)}
                  >
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.track}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={paymentVariant(member.paymentStatus)}>
                        {member.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <MemberSheet
        memberId={selectedMemberId}
        open={!!selectedMemberId}
        onOpenChange={(open) => {
          if (!open) deleteParam("member");
        }}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => updateParam("page", String(p))}
      />
    </div>
  );
}
