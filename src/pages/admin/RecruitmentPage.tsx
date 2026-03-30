import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRecruitmentPeriod } from "@/hooks/use-applications";
import { toast } from "sonner";
import type { RecruitmentPeriod } from "@/types/application";

function RecruitmentCard({ type, label, description }: {
  type: "beginner" | "conversion";
  label: string;
  description: string;
}) {
  const { data: period, isLoading, isError } = useRecruitmentPeriod(type);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-4">
          <Alert variant="destructive">
            <AlertDescription>모집 기간 정보를 불러오지 못했습니다.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <RecruitmentCardContent
      period={period}
      label={label}
      description={description}
    />
  );
}

function RecruitmentCardContent({ period, label, description }: {
  period: RecruitmentPeriod | null | undefined;
  label: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>{label}</CardTitle>
          <Badge variant={period?.isActive ? "default" : "outline"}>
            {period?.isActive ? "활성" : "비활성"}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {period ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>시작일</Label>
              <Input
                type="date"
                defaultValue={period.startDate.slice(0, 10)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>종료일</Label>
              <Input
                type="date"
                defaultValue={period.endDate.slice(0, 10)}
                disabled
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            설정된 모집 기간이 없습니다.
          </p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            toast.info("모집 기간 수정 기능은 준비 중입니다.");
          }}
        >
          기간 수정
        </Button>
      </CardContent>
    </Card>
  );
}

export function RecruitmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">모집 기간 관리</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecruitmentCard
          type="beginner"
          label="비기너 모집"
          description="비기너 지원 모집 기간을 관리합니다."
        />
        <RecruitmentCard
          type="conversion"
          label="즉시 전환"
          description="즉시 전환 신청 기간을 관리합니다."
        />
      </div>
    </div>
  );
}
