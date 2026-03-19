import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useMember } from "@/hooks/use-members";
import type { MemberDetail } from "@/types/member";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  );
}

function EditForm({
  member,
  onCancel,
}: {
  member: MemberDetail;
  onCancel: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [department, setDepartment] = useState(member.department);
  const [studentId, setStudentId] = useState(member.student_id);
  const [schoolEmail, setSchoolEmail] = useState(member.school_email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 백엔드에 PUT /v1/members/{member_id} API 추가 필요
    toast.error("수정 API가 아직 준비되지 않았습니다.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">기본 정보</h2>
        <div className="space-y-3 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="edit-name">이름</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>이메일</Label>
            <Input value={member.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-phone">전화번호</Label>
            <Input id="edit-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">학교 정보</h2>
        <div className="space-y-3 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="edit-dept">학과</Label>
            <Input id="edit-dept" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-sid">학번</Label>
            <Input id="edit-sid" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-school-email">학교 이메일</Label>
            <Input id="edit-school-email" type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">저장</Button>
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, isError } = useMember(memberId ?? "");
  const [editing, setEditing] = useState(false);

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
        {!editing && (
          <Button variant="outline" className="gap-1" onClick={() => setEditing(true)}>
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

        {editing ? (
          <EditForm member={member} onCancel={() => setEditing(false)} />
        ) : (
          <>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">기본 정보</h2>
              <div className="divide-y rounded-lg border px-4">
                <InfoRow label="이름" value={member.name} />
                <InfoRow label="이메일" value={member.email} />
                <InfoRow label="전화번호" value={member.phone} />
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">학교 정보</h2>
              <div className="divide-y rounded-lg border px-4">
                <InfoRow label="학과" value={member.department} />
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
          </>
        )}
      </div>
    </div>
  );
}
