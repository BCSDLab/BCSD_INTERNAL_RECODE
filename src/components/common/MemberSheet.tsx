import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DetailRow } from "@/components/common/DetailRow";
import { useMember } from "@/hooks/use-members";

interface MemberSheetProps {
  memberId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberSheet({ memberId, open, onOpenChange }: MemberSheetProps) {
  const { data: member, isLoading, isError } = useMember(memberId ?? "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" resizable className="overflow-y-auto">
        {isLoading && (
          <>
            <SheetHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </SheetHeader>
            <div className="space-y-3 px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </>
        )}

        {isError && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>멤버 정보를 불러오지 못했습니다.</AlertDescription>
            </Alert>
          </div>
        )}

        {member && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <SheetTitle>{member.name}</SheetTitle>
                <Badge>{member.status}</Badge>
              </div>
              <SheetDescription>{member.email}</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <dl>
                <DetailRow label="이메일">{member.email}</DetailRow>
                <Separator />
                <DetailRow label="학교 이메일">{member.schoolEmail}</DetailRow>
                <Separator />
                <DetailRow label="학부(학과)">{member.department}</DetailRow>
                <Separator />
                <DetailRow label="학번">{member.studentId}</DetailRow>
                <Separator />
                <DetailRow label="전화번호">{member.phone}</DetailRow>
                <Separator />
                <DetailRow label="트랙">{member.track}</DetailRow>
                <Separator />
                <DetailRow label="가입일">{member.joinDate}</DetailRow>
              </dl>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
