import { MemberSheet } from "@/components/common/MemberSheet";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination } from "@/components/common/Pagination";
import { useTableState } from "@/hooks/use-table-state";
import { useMembersWithFilters } from "@/hooks/use-members";
import { statusVariant } from "@/lib/format";
import type { MemberFilterInput } from "@/types/common";
import type { MemberResponse } from "@/types/member";
import type { ColumnDef } from "@/types/data-table";

const PAGE_SIZE = 20;
const FILTER_KEYS = ["name", "email", "track", "status", "department", "studentId", "phone"];

export function MembersPage() {
  const {
    searchParams, page, sorts, getFilters,
    setSort, setFilter, setPage, setParam, deleteParam,
  } = useTableState();

  const selectedMemberId = searchParams.get("member");
  const filters = getFilters(FILTER_KEYS);

  const filter: MemberFilterInput = {
    page,
    size: PAGE_SIZE,
    ...(sorts.length > 0 && { sorts: sorts.map((s) => ({ field: s.field, order: s.direction })) }),
    ...(filters.name && { name: filters.name }),
    ...(filters.email && { email: filters.email }),
    ...(filters.track && { track: filters.track }),
    ...(filters.status && { status: filters.status }),
    ...(filters.department && { department: filters.department }),
    ...(filters.studentId && { studentId: filters.studentId }),
    ...(filters.phone && { phone: filters.phone }),
  };

  const { data: result, isLoading, isError } = useMembersWithFilters(filter);
  const data = result?.members;
  const filterOptions = result?.memberFilters;
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const columns: ColumnDef<MemberResponse>[] = [
    {
      id: "track",
      header: "트랙",
      cell: (m) => m.track,
      sortable: true,
      filterType: "enum",
      filterParamKey: "track",
      filterOptions: filterOptions?.tracks.map((t) => ({ value: t, label: t })),
      className: "w-28",
    },
    {
      id: "status",
      header: "구분",
      cell: (m) => <Badge variant={statusVariant(m.status)}>{m.status}</Badge>,
      sortable: true,
      filterType: "enum",
      filterParamKey: "status",
      filterOptions: filterOptions?.statuses.map((s) => ({ value: s, label: s })),
      className: "w-24",
    },
    {
      id: "name",
      header: "이름",
      cell: (m) => <span className="font-medium">{m.name}</span>,
      sortable: true,
      filterType: "text",
      filterParamKey: "name",
      className: "w-24",
    },
    {
      id: "department",
      header: "학부",
      cell: (m) => m.department ?? "-",
      sortable: true,
      filterType: "text",
      filterParamKey: "department",
      className: "w-32",
    },
    {
      id: "studentId",
      header: "학번",
      cell: (m) => m.studentId ?? "-",
      sortable: true,
      filterType: "text",
      filterParamKey: "studentId",
      className: "w-28",
    },
    {
      id: "phone",
      header: "전화번호",
      cell: (m) => m.phone ?? "-",
      sortable: true,
      filterType: "text",
      filterParamKey: "phone",
      className: "w-32",
    },
    {
      id: "email",
      header: "이메일",
      cell: (m) => m.email,
      sortable: true,
      filterType: "text",
      filterParamKey: "email",
      className: "w-48",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">멤버 관리</h1>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>멤버 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={data?.items}
        isLoading={isLoading}
        sorts={sorts}
        filters={filters}
        onSort={setSort}
        onFilterChange={setFilter}
        onRowClick={(m) => setParam("member", m.id)}
        rowKey={(m) => m.id}
        emptyMessage="검색 결과가 없습니다."
      />

      <MemberSheet
        memberId={selectedMemberId}
        open={!!selectedMemberId}
        onOpenChange={(open) => {
          if (!open) deleteParam("member");
        }}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
