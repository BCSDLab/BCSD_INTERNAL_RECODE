import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApplications } from "@/hooks/use-applications";
import { applicationStatusLabel, applicationStatusVariant, formatDate } from "@/lib/format";
import { ApplicationSheet } from "./ApplicationSheet";
import type { Application } from "@/types/application";
import type { ColumnDef } from "@/types/data-table";

export function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formId = searchParams.get("formId") ?? "";
  const [formIdInput, setFormIdInput] = useState(formId);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const selectedId = searchParams.get("application");

  const { data, isLoading, isError } = useApplications(formId);

  const columns: ColumnDef<Application>[] = [
    {
      id: "memberId",
      header: "회원 ID",
      cell: (a) => <span className="font-medium">{a.memberId}</span>,
      className: "w-[25%]",
    },
    {
      id: "submittedAt",
      header: "지원일",
      cell: (a) => formatDate(a.submittedAt),
      sortable: true,
      className: "w-[25%]",
    },
    {
      id: "status",
      header: "상태",
      cell: (a) => (
        <Badge variant={applicationStatusVariant(a.status)}>
          {applicationStatusLabel(a.status)}
        </Badge>
      ),
      className: "w-[25%]",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">지원자 관리</h1>

      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="formIdInput">폼 ID</Label>
          <Input
            id="formIdInput"
            value={formIdInput}
            onChange={(e) => setFormIdInput(e.target.value)}
            placeholder="조회할 폼 ID를 입력하세요"
            className="w-64"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (formIdInput) {
                next.set("formId", formIdInput);
              } else {
                next.delete("formId");
              }
              return next;
            });
          }}
        >
          조회
        </button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>지원자 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      {!formId && (
        <p className="text-sm text-muted-foreground">폼 ID를 입력하고 조회 버튼을 눌러주세요.</p>
      )}

      {formId && (
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          sorts={[]}
          filters={{}}
          onSort={() => {}}
          onFilterChange={() => {}}
          onRowClick={(a) => {
            setSelectedApplication(a);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("application", a.id);
              return next;
            });
          }}
          rowKey={(a) => a.id}
          emptyMessage="지원자가 없습니다."
        />
      )}

      <ApplicationSheet
        application={selectedApplication}
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("application");
              return next;
            });
            setSelectedApplication(null);
          }
        }}
      />
    </div>
  );
}
