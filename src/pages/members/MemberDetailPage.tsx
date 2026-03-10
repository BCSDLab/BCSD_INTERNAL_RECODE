import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useMember } from "@/hooks/use-members";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{children}</dd>
    </div>
  );
}

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, isError } = useMember(memberId ?? "");

  if (isLoading) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !member) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertDescription>멤버 정보를 불러오지 못했습니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        목록으로
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>{member.name}</CardTitle>
            <Badge>{member.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="ID">{member.id}</DetailRow>
            <Separator />
            <DetailRow label="이메일">{member.email}</DetailRow>
            <Separator />
            <DetailRow label="학교 이메일">{member.school_email}</DetailRow>
            <Separator />
            <DetailRow label="전화번호">{member.phone}</DetailRow>
            <Separator />
            <DetailRow label="트랙">{member.track}</DetailRow>
            <Separator />
            <DetailRow label="팀">{member.team || "-"}</DetailRow>
            <Separator />
            <DetailRow label="납부 상태">
              <Badge
                variant={
                  member.payment_status === "Paid"
                    ? "default"
                    : member.payment_status === "Unpaid"
                      ? "destructive"
                      : "secondary"
                }
              >
                {member.payment_status}
              </Badge>
            </DetailRow>
            <Separator />
            <DetailRow label="가입일">{member.join_date}</DetailRow>
            <Separator />
            <DetailRow label="마지막 수정">{member.last_updated}</DetailRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
