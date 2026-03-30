import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination } from "@/components/common/Pagination";
import { useTableState } from "@/hooks/use-table-state";
import { useApplications } from "@/hooks/use-applications";
import { applicationStatusLabel, applicationStatusVariant, formatDate } from "@/lib/format";
import { ApplicationSheet } from "./ApplicationSheet";
import type { ApplicationListItem } from "@/types/application";
import type { ColumnDef } from "@/types/data-table";

const PAGE_SIZE = 20;
const FILTER_KEYS = ["applicantName", "applicantEmail", "track", "status"];

export function ApplicationsPage() {
  const {
    searchParams, page, sorts, getFilters,
    setSort, setFilter, setPage, setParam, deleteParam,
  } = useTableState();

  const [selectedApplication, setSelectedApplication] = useState<ApplicationListItem | null>(null);
  const selectedId = searchParams.get("application");
  const filters = getFilters(FILTER_KEYS);

  const filter: Record<string, unknown> = {
    page,
    size: PAGE_SIZE,
    ...(sorts.length > 0 && { sorts: sorts.map((s) => ({ field: s.field, order: s.direction })) }),
    ...(filters.applicantName && { applicantName: filters.applicantName }),
    ...(filters.applicantEmail && { applicantEmail: filters.applicantEmail }),
    ...(filters.track && { track: filters.track }),
    ...(filters.status && { status: filters.status }),
  };

  const { data, isLoading, isError } = useApplications(filter);
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const columns: ColumnDef<ApplicationListItem>[] = [
    {
      id: "applicantName",
      header: "이름",
      cell: (a) => <span className="font-medium">{a.applicantName}</span>,
      sortable: true,
      filterType: "text",
      filterParamKey: "applicantName",
      className: "w-[15%]",
    },
    {
      id: "applicantEmail",
      header: "이메일",
      cell: (a) => <span className="break-all">{a.applicantEmail}</span>,
      sortable: true,
      filterType: "text",
      filterParamKey: "applicantEmail",
      className: "w-[25%]",
    },
    {
      id: "track",
      header: "희망 트랙",
      cell: (a) => a.track,
      sortable: true,
      filterType: "text",
      filterParamKey: "track",
      className: "w-[15%]",
    },
    {
      id: "submittedAt",
      header: "지원일",
      cell: (a) => formatDate(a.submittedAt),
      sortable: true,
      className: "w-[15%]",
    },
    {
      id: "status",
      header: "상태",
      cell: (a) => (
        <Badge variant={applicationStatusVariant(a.status)}>
          {applicationStatusLabel(a.status)}
        </Badge>
      ),
      sortable: true,
      filterType: "text",
      filterParamKey: "status",
      className: "w-[15%]",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">지원자 관리</h1>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>지원자 목록을 불러오지 못했습니다.</AlertDescription>
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
        onRowClick={(a) => {
          setSelectedApplication(a);
          setParam("application", a.id);
        }}
        rowKey={(a) => a.id}
        emptyMessage="지원자가 없습니다."
      />

      <ApplicationSheet
        application={selectedApplication}
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) {
            deleteParam("application");
            setSelectedApplication(null);
          }
        }}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
