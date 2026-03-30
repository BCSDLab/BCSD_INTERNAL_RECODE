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
import { useMyApplications, useCancelApplication } from "@/hooks/use-applications";
import { toast } from "sonner";
import { applicationStatusLabel, applicationStatusVariant, formatDate } from "@/lib/format";

export function ConvertStatusPage() {
  const navigate = useNavigate();
  const { data: myApps, isLoading } = useMyApplications();
  const cancelMutation = useCancelApplication();

  const app = myApps?.find((a) => a.status !== "cancelled") ?? null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!app) {
    navigate("/convert", { replace: true });
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
            <CardTitle>레귤러로 승인되었습니다!</CardTitle>
            <CardDescription>레귤러 회비 납부 안내를 확인해주세요.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>전환 신청 상태</CardTitle>
            <CardDescription>신청 진행 상황을 확인할 수 있습니다.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <dl>
          <DetailRow label="신청일">{formatDate(app.submittedAt)}</DetailRow>
          <Separator />
          <DetailRow label="상태">
            <Badge variant={applicationStatusVariant(app.status)}>
              {applicationStatusLabel(app.status)}
            </Badge>
          </DetailRow>
        </dl>

        {app.answers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">제출한 답변</h3>
              {app.answers.map((answer) => (
                <div key={answer.id} className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">질문 ID: {answer.questionId}</p>
                  <p className="text-sm">{answer.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {app.status !== "approved" && app.status !== "cancelled" && (
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-4 text-sm shadow-xs hover:bg-accent/50">
              전환 취소
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>전환 신청을 취소하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  취소 후에는 다시 신청할 수 있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>돌아가기</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    cancelMutation.mutate(app.id, {
                      onSuccess: () => {
                        toast.success("전환 신청이 취소되었습니다.");
                        navigate("/convert");
                      },
                    });
                  }}
                >
                  취소하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
