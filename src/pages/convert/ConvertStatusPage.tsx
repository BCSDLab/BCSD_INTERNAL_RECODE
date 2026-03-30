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
import { DetailRow } from "@/components/common/DetailRow";
import { useMyApplication } from "@/hooks/use-applications";

export function ConvertStatusPage() {
  const navigate = useNavigate();
  const { data: app, isLoading } = useMyApplication();

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
          <DetailRow label="신청일">{app.submittedAt.slice(0, 10)}</DetailRow>
          <Separator />
          <DetailRow label="희망 트랙">{app.track}</DetailRow>
          <Separator />
          <DetailRow label="상태">
            <Badge variant={app.status === "approved" ? "default" : "outline"}>
              {app.status === "pending_payment" ? "심사 중" : app.status === "approved" ? "승인" : app.status}
            </Badge>
          </DetailRow>
        </dl>

        {app.status === "pending_payment" && (
          <p className="text-center text-sm text-muted-foreground">
            심사가 진행 중입니다. 잠시만 기다려주세요.
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
