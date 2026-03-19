import { useState, useMemo } from "react";
import { useSearchParamState } from "@/hooks/use-search-param-state";
import { FilterSelect } from "@/components/common/FilterSelect";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { toast } from "sonner";
import { useLinks, useLinkFilters } from "@/hooks/use-links";
import { LinkSheet } from "./LinkSheet";
import { LinkDialog } from "./LinkDialog";
import { shortUrl } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { LinkFilterInput, LinkDetail } from "@/types/link";

const PAGE_SIZE = 20;

function isLinkExpired(link: { expiredAt: string | null; expiresAt: string | null }) {
  if (link.expiredAt) return true;
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return true;
  return false;
}

function expiredBadge(link: { expiredAt: string | null; expiresAt: string | null }) {
  if (isLinkExpired(link)) {
    return <Badge variant="destructive">만료</Badge>;
  }
  return <Badge variant="default">활성</Badge>;
}

export function LinksPage() {
  const { searchParams, page, updateParam, setParam, deleteParam } = useSearchParamState();

  const creatorId = searchParams.get("creator_id") ?? "";
  const expired = searchParams.get("expired") ?? "";
  const selectedLinkId = searchParams.get("link");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<LinkDetail | undefined>();

  const filter: LinkFilterInput = {
    page,
    size: PAGE_SIZE,
    ...(creatorId && { creatorId }),
    ...(expired && { expired }),
  };

  const { data: filterOptions } = useLinkFilters();
  const { data, isLoading, isError } = useLinks(filter);

  const creatorMap = useMemo(() => {
    const map = new Map<string, string>();
    filterOptions?.creators.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [filterOptions]);


  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const hasFilters = creatorId || expired;

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

      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect value={creatorId} allLabel="전체 생성자" options={filterOptions?.creators.map(c => ({ value: c.id, label: c.name }))} onValueChange={(v) => updateParam("creator_id", v)} className="w-40" />
        <FilterSelect value={expired} allLabel="전체 상태" options={[{ value: "active", label: "활성" }, { value: "expired", label: "만료" }]} onValueChange={(v) => updateParam("expired", v)} />
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>링크 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>단축 URL</TableHead>
              <TableHead>생성자</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>만료일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? <TableSkeleton columns={6} />
              : data?.items.map((link) => (
                  <TableRow
                    key={link.id}
                    className="cursor-pointer"
                    onClick={() => setParam("link", link.id)}
                  >
                    <TableCell className="font-medium">{link.title}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(shortUrl(link.code));
                          toast.success("단축 URL이 복사되었습니다.");
                        }}
                      >
                        {shortUrl(link.code)}
                      </Button>
                    </TableCell>
                    <TableCell>{creatorMap.get(link.creatorId) ?? link.creatorId}</TableCell>
                    <TableCell>{formatDate(link.createdAt)}</TableCell>
                    <TableCell>{expiredBadge(link)}</TableCell>
                    <TableCell>
                      {link.expiresAt ? formatDate(link.expiresAt) : "무기한"}
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  {hasFilters ? (
                    "검색 결과가 없습니다."
                  ) : (
                    <div className="space-y-2">
                      <p>등록된 링크가 없습니다.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditData(undefined);
                          setDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        새 링크 만들기
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => updateParam("page", String(p))}
      />
    </div>
  );
}
