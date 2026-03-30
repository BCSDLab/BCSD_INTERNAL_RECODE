import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DetailRow } from "@/components/common/DetailRow";
import { useMyApplication, useCancelApplication } from "@/hooks/use-applications";
import { toast } from "sonner";
import { applicationStatusLabel, applicationStatusVariant } from "@/lib/format";

export function ApplyStatusPage() {
  const navigate = useNavigate();
  const { data: app, isLoading } = useMyApplication();
  const cancelMutation = useCancelApplication();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!app || app.status === "cancelled") {
    navigate("/apply", { replace: true });
    return null;
  }

  return (
    <Card>
      <CardHeader className="text-center">
        {app.status === "approved" ? (
          <>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>BCSD 비기너로 승인되었습니다!</CardTitle>
            <CardDescription>아래 슬랙 워크스페이스에 가입해주세요.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>지원 상태</CardTitle>
            <CardDescription>지원 진행 상황을 확인할 수 있습니다.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <dl>
          <DetailRow label="지원일">{app.submittedAt.slice(0, 10)}</DetailRow>
          <Separator />
          <DetailRow label="희망 트랙">{app.track}</DetailRow>
          <Separator />
          <DetailRow label="상태">
            <Badge variant={applicationStatusVariant(app.status)}>
              {applicationStatusLabel(app.status)}
            </Badge>
          </DetailRow>
        </dl>

        {app.status === "pending_payment" && app.paymentInfo && (
          <>
            <Separator />
            <div className="space-y-2 rounded-lg border p-4">
              <h3 className="text-sm font-medium">납부 안내</h3>
              <dl className="text-sm">
                <DetailRow label="은행">{app.paymentInfo.bank}</DetailRow>
                <DetailRow label="계좌번호">{app.paymentInfo.account}</DetailRow>
                <DetailRow label="금액">{app.paymentInfo.amount.toLocaleString()}원</DetailRow>
                <DetailRow label="예금주">{app.paymentInfo.holder}</DetailRow>
              </dl>
            </div>
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-4 text-sm shadow-xs hover:bg-accent/50">
                지원 취소
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>지원을 취소하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    취소 후에는 다시 지원할 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>돌아가기</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      cancelMutation.mutate(app.id, {
                        onSuccess: () => {
                          toast.success("지원이 취소되었습니다.");
                          navigate("/apply");
                        },
                      });
                    }}
                  >
                    취소하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {app.status === "paid" && (
          <p className="text-center text-sm text-muted-foreground">
            납부가 확인되었습니다. 승인을 기다려주세요.
          </p>
        )}

        {app.status === "approved" && (
          <div className="space-y-3">
            <Button className="w-full gap-2" onClick={() => window.open("https://bcsdlab.slack.com", "_blank")}>
              <ExternalLink className="h-4 w-4" />
              슬랙 워크스페이스 가입
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/members")}>
              메인으로 이동
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
