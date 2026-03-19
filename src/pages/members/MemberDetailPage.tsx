import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useMember } from "@/hooks/use-members";

function InfoRow({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {editing && onChange ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-48 text-right text-sm"
        />
      ) : (
        <span className="text-sm font-medium">{value || "-"}</span>
      )}
    </div>
  );
}

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, isError } = useMember(memberId ?? "");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  const startEditing = () => {
    if (!member) return;
    setName(member.name);
    setPhone(member.phone);
    setDepartment(member.department);
    setEditing(true);
  };

  const handleSave = () => {
    // TODO: 백엔드에 PUT /v1/members/{member_id} API 추가 필요
    toast.error("수정 API가 아직 준비되지 않았습니다.");
  };

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
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Button>
        {editing ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>저장</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>취소</Button>
          </div>
        ) : (
          <Button variant="outline" className="gap-1" onClick={startEditing}>
            <Pencil className="h-4 w-4" />
            수정
          </Button>
        )}
      </div>

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
            <InfoRow label="이름" value={editing ? name : member.name} editing={editing} onChange={setName} />
            <InfoRow label="이메일" value={member.email} />
            <InfoRow label="전화번호" value={editing ? phone : member.phone} editing={editing} onChange={setPhone} />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">학교 정보</h2>
          <div className="divide-y rounded-lg border px-4">
            <InfoRow label="학과" value={editing ? department : member.department} editing={editing} onChange={setDepartment} />
            <InfoRow label="학번" value={member.student_id} />
            <InfoRow label="학교 이메일" value={member.school_email} />
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
