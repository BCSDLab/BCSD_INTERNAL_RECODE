import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { useLinkDetail, useToggleLink, useDeleteLink } from "@/hooks/use-links";
import { shortUrl } from "@/lib/constants";
import type { LinkDetail } from "@/types/link";
import type { ChartConfig } from "@/components/ui/chart";

interface LinkSheetProps {
  linkId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (detail: LinkDetail) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm break-all">{children}</dd>
    </div>
  );
}

const chartConfig: ChartConfig = {
  count: {
    label: "클릭",
    color: "var(--color-primary)",
  },
};

export function LinkSheet({ linkId, open, onOpenChange, onEdit }: LinkSheetProps) {
  const { data: detail, isLoading, isError } = useLinkDetail(linkId);
  const toggleMutation = useToggleLink();
  const deleteMutation = useDeleteLink();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isExpired = detail
    ? !!(detail.expired_at || (detail.expires_at && new Date(detail.expires_at) < new Date()))
    : false;

  const handleToggle = () => {
    if (!linkId) return;
    toggleMutation.mutate(linkId, {
      onSuccess: () => {
        toast.success("링크 상태가 변경되었습니다.");
      },
    });
  };

  const handleDelete = () => {
    if (!linkId) return;
    deleteMutation.mutate(linkId, {
      onSuccess: () => {
        toast.success("링크가 삭제되었습니다.");
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="overflow-y-auto">
          {isLoading && (
            <>
              <SheetHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </SheetHeader>
              <div className="space-y-3 px-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </>
          )}

          {isError && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertDescription>링크 정보를 불러오지 못했습니다.</AlertDescription>
              </Alert>
            </div>
          )}

          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.title}</SheetTitle>
                <SheetDescription>{shortUrl(detail.code)}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-4">
                <dl>
                  <DetailRow label="원본 URL">
                    <a
                      href={detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {detail.url}
                    </a>
                  </DetailRow>
                  <Separator />
                  <DetailRow label="단축 URL">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-blue-600"
                      onClick={() => {
                        navigator.clipboard.writeText(shortUrl(detail.code));
                        toast.success("단축 URL이 복사되었습니다.");
                      }}
                    >
                      {shortUrl(detail.code)}
                    </Button>
                  </DetailRow>
                  <Separator />
                  <DetailRow label="상태">
                    <Badge variant={isExpired ? "destructive" : "default"}>
                      {isExpired ? "만료" : "활성"}
                    </Badge>
                  </DetailRow>
                  <Separator />
                  <DetailRow label="만료일">
                    {detail.expires_at ? detail.expires_at.slice(0, 10) : "무기한"}
                  </DetailRow>
                  {detail.description && (
                    <>
                      <Separator />
                      <DetailRow label="설명">{detail.description}</DetailRow>
                    </>
                  )}
                </dl>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(detail)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggle}
                    disabled={toggleMutation.isPending}
                  >
                    {isExpired ? "활성화" : "비활성화"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                  >
                    삭제
                  </Button>
                </div>

                <Separator className="my-4" />

                <div>
                  <div className="mb-2 text-sm font-medium">클릭 통계</div>
                  <div className="mb-4 text-2xl font-bold">
                    {detail.total_clicks.toLocaleString()}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      총 클릭
                    </span>
                  </div>
                  {detail.daily_clicks.length > 0 && (
                    <ChartContainer config={chartConfig} className="h-40 w-full">
                      <BarChart data={detail.daily_clicks}>
                        <XAxis
                          dataKey="date"
                          tickFormatter={(v: string) => v.slice(5)}
                          fontSize={11}
                        />
                        <YAxis fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>링크 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 링크를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
