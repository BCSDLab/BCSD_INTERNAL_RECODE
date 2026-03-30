import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DetailRow } from "@/components/common/DetailRow";
import { useApproveApplications } from "@/hooks/use-applications";
import { applicationStatusLabel, applicationStatusVariant, formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Application } from "@/types/application";

interface ApplicationSheetProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationSheet({ application, open, onOpenChange }: ApplicationSheetProps) {
  const approveMutation = useApproveApplications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" resizable className="overflow-y-auto">
        {application && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <SheetTitle>지원서 상세</SheetTitle>
                <Badge variant={applicationStatusVariant(application.status)}>
                  {applicationStatusLabel(application.status)}
                </Badge>
              </div>
              <SheetDescription>회원 ID: {application.memberId}</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <dl>
                <DetailRow label="폼 ID">{application.formId}</DetailRow>
                <Separator />
                <DetailRow label="회원 ID">{application.memberId}</DetailRow>
                <Separator />
                <DetailRow label="지원일">{formatDate(application.submittedAt)}</DetailRow>
                <Separator />
                <DetailRow label="상태">
                  <Badge variant={applicationStatusVariant(application.status)}>
                    {applicationStatusLabel(application.status)}
                  </Badge>
                </DetailRow>
              </dl>

              {application.answers.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">제출 답변</h3>
                    {application.answers.map((answer) => (
                      <div key={answer.id} className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">질문 ID: {answer.questionId}</p>
                        <p className="text-sm">{answer.value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {application.status !== "approved" && application.status !== "cancelled" && (
                <div className="mt-6">
                  <Button
                    className="w-full"
                    disabled={approveMutation.isPending}
                    onClick={() => {
                      approveMutation.mutate([application.id], {
                        onSuccess: () => {
                          toast.success("지원자가 승인되었습니다.");
                          onOpenChange(false);
                        },
                      });
                    }}
                  >
                    {approveMutation.isPending ? "승인 중..." : "승인하기"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
