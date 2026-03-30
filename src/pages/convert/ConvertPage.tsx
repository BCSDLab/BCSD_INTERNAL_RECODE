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
  useSubmitApplication,
} from "@/hooks/use-applications";
import { toast } from "sonner";

export function ConvertPage() {
  const navigate = useNavigate();
  const me = useMe();
  const member = me.data?.member;
  const { data: myApp, isLoading: appLoading } = useMyApplication();
  const { data: formTemplate, isLoading: formLoading } = useFormTemplate("conversion");
  const { data: filterData } = useMemberFilters();
  const submitMutation = useSubmitApplication();

  const isLoading = me.isLoading || appLoading || formLoading;

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
    navigate("/convert/status", { replace: true });
    return null;
  }

  // 폼 로드 실패
  if (!formTemplate) {
    return (
      <Alert variant="destructive">
        <AlertDescription>신청 폼을 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>즉시 전환 신청</CardTitle>
        <CardDescription>비기너 과정 없이 바로 레귤러로 합류합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          가입비 없음 — 전환 승인 시 레귤러 회비를 납부합니다.
        </div>
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
                  toast.success("즉시 전환 신청이 완료되었습니다.");
                  navigate("/convert/status");
                },
              },
            );
          }}
          isPending={submitMutation.isPending}
          submitLabel="신청하기"
        />
      </CardContent>
    </Card>
  );
}
