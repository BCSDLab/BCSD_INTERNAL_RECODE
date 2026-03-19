import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMember } from "@/hooks/use-members";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  );
}

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, isError } = useMember(memberId ?? "");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          뒤로
        </Button>
        <p className="text-muted-foreground">멤버 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </Button>

      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-lg">
              {member.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{member.name}</h1>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant="outline">{member.track}</Badge>
              <Badge variant="secondary">{member.status}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">기본 정보</h2>
          <div className="divide-y rounded-lg border px-4">
            <InfoRow label="이름" value={member.name} />
            <InfoRow label="이메일" value={member.email} />
            <InfoRow label="학교 이메일" value={member.school_email} />
            <InfoRow label="전화번호" value={member.phone} />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">학교 정보</h2>
          <div className="divide-y rounded-lg border px-4">
            <InfoRow label="학과" value={member.department} />
            <InfoRow label="학번" value={member.student_id} />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">활동 정보</h2>
          <div className="divide-y rounded-lg border px-4">
            <InfoRow label="트랙" value={member.track} />
            <InfoRow label="상태" value={member.status} />
            <InfoRow label="가입일" value={member.join_date?.split("T")[0] ?? "-"} />
            <InfoRow label="최근 수정일" value={member.last_updated?.split("T")[0] ?? "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}
