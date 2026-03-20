import { useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination } from "@/components/common/Pagination";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTableState } from "@/hooks/use-table-state";
import { useLinks, useLinkFilters } from "@/hooks/use-links";
import { LinkSheet } from "./LinkSheet";
import { LinkDialog } from "./LinkDialog";
import { shortUrl } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { LinkFilterInput, Link, LinkDetail } from "@/types/link";
import type { ColumnDef } from "@/types/data-table";

const PAGE_SIZE = 20;
const FILTER_KEYS = ["title", "code", "creator_id", "expired"];

function isLinkExpired(link: { expiredAt: string | null; expiresAt: string | null }) {
  if (link.expiredAt) return true;
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return true;
  return false;
}

export function LinksPage() {
  const {
    searchParams, page, sorts, getFilters,
    setSort, setFilter, setPage, setParam, deleteParam,
  } = useTableState();

  const selectedLinkId = searchParams.get("link");
  const filters = getFilters(FILTER_KEYS);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<LinkDetail | undefined>();

  const filter: LinkFilterInput = {
    page,
    size: PAGE_SIZE,
    ...(sorts.length > 0 && { sorts: sorts.map((s) => ({ field: s.field, order: s.direction })) }),
    ...(filters.title && { title: filters.title }),
    ...(filters.code && { code: filters.code }),
    ...(filters.creator_id && { creatorId: filters.creator_id }),
    ...(filters.expired && { expired: filters.expired }),
  };

  const { data: filterOptions } = useLinkFilters();
  const { data, isLoading, isError } = useLinks(filter);
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const creatorMap = useMemo(() => {
    const map = new Map<string, string>();
    filterOptions?.creators.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [filterOptions]);

  const columns: ColumnDef<Link>[] = [
    {
      id: "title",
      header: "제목",
      cell: (l) => <span className="font-medium">{l.title}</span>,
      sortable: true,
      filterType: "text",
      filterParamKey: "title",
    },
    {
      id: "code",
      header: "단축 URL",
      cell: (l) => (
        <Button
          variant="link"
          className="h-auto p-0 text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(shortUrl(l.code));
            toast.success("단축 URL이 복사되었습니다.");
          }}
        >
          {shortUrl(l.code)}
        </Button>
      ),
      sortable: true,
      filterType: "text",
      filterParamKey: "code",
    },
    {
      id: "creatorId",
      header: "생성자",
      cell: (l) => creatorMap.get(l.creatorId) ?? l.creatorId,
      sortable: true,
      filterType: "enum",
      filterParamKey: "creator_id",
      filterOptions: filterOptions?.creators.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      id: "createdAt",
      header: "생성일",
      cell: (l) => formatDate(l.createdAt),
      sortable: true,
      filterType: "date",
    },
    {
      id: "expired",
      header: "상태",
      cell: (l) => isLinkExpired(l)
        ? <Badge variant="destructive">만료</Badge>
        : <Badge variant="default">활성</Badge>,
      sortable: true,
      filterType: "enum",
      filterParamKey: "expired",
      filterOptions: [
        { value: "active", label: "활성" },
        { value: "expired", label: "만료" },
      ],
    },
    {
      id: "expiresAt",
      header: "만료일",
      cell: (l) => l.expiresAt ? formatDate(l.expiresAt) : "무기한",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">URL 단축</h1>
        <Button
          onClick={() => {
            setEditData(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          새 링크
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>링크 목록을 불러오지 못했습니다.</AlertDescription>
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
        onRowClick={(l) => setParam("link", l.id)}
        rowKey={(l) => l.id}
        emptyMessage="등록된 링크가 없습니다."
      />

      <LinkSheet
        linkId={selectedLinkId}
        open={!!selectedLinkId}
        onOpenChange={(open) => {
          if (!open) deleteParam("link");
        }}
        onEdit={(detail) => {
          setEditData(detail);
          setDialogOpen(true);
        }}
      />

      <LinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editData={editData}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
