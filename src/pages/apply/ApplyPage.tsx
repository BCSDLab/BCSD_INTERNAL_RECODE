import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DynamicForm } from "@/components/common/DynamicForm";
import { useMe } from "@/hooks/use-auth";
import { useMemberFilters } from "@/hooks/use-members";
import {
  useMyApplication,
  useFormTemplate,
  useRecruitmentPeriod,
  useSubmitApplication,
} from "@/hooks/use-applications";
import { toast } from "sonner";

export function ApplyPage() {
  const navigate = useNavigate();
  const me = useMe();
  const member = me.data?.member;
  const { data: myApp, isLoading: appLoading } = useMyApplication();
  const { data: recruitment, isLoading: recruitLoading } = useRecruitmentPeriod("beginner");
  const { data: formTemplate, isLoading: formLoading } = useFormTemplate("beginner");
  const { data: filterData } = useMemberFilters();
  const submitMutation = useSubmitApplication();

  const isLoading = me.isLoading || appLoading || recruitLoading || formLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // 이미 활동 중인 회원
  if (member?.status === "Regular" || member?.status === "Beginner" || member?.status === "Mentor") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>이미 활동 중인 회원입니다</CardTitle>
          <CardDescription>추가 지원이 필요하지 않습니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => navigate("/members")}>메인으로 이동</Button>
        </CardContent>
      </Card>
    );
  }

  // 이미 지원서 제출
  if (myApp && myApp.status !== "cancelled") {
    navigate("/apply/status", { replace: true });
    return null;
  }

  // 모집 기간 아님
  if (!recruitment?.isActive) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>현재 모집 기간이 아닙니다</CardTitle>
          <CardDescription>
            {recruitment
              ? `모집 기간: ${recruitment.startDate} ~ ${recruitment.endDate}`
              : "다음 모집을 기다려주세요."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 폼 로드 실패
  if (!formTemplate) {
    return (
      <Alert variant="destructive">
        <AlertDescription>지원 폼을 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>비기너 지원</CardTitle>
        <CardDescription>BCSD 비기너로 지원합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <DynamicForm
          questions={formTemplate.questions}
          fixedFields={{
            name: member?.name ?? "",
            email: me.data?.email ?? "",
            schoolEmail: "",
            track: member?.track ?? "",
          }}
          trackOptions={filterData?.tracks ?? []}
          onSubmit={(answers, track) => {
            submitMutation.mutate(
              { formTemplateId: formTemplate.id, answers, track },
              {
                onSuccess: () => {
                  toast.success("지원이 완료되었습니다.");
                  navigate("/apply/status");
                },
              },
            );
          }}
          isPending={submitMutation.isPending}
          submitLabel="지원하기"
        />
      </CardContent>
    </Card>
  );
}
