import { useNavigate, useSearchParams } from "react-router-dom";
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
import {
  useMyApplications,
  useForm,
  useSubmitApplication,
} from "@/hooks/use-applications";
import { toast } from "sonner";

export function ConvertPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId") ?? "";
  const me = useMe();
  const member = me.data?.member;
  const { data: myApps, isLoading: appsLoading } = useMyApplications();
  const { data: form, isLoading: formLoading } = useForm(formId);
  const submitMutation = useSubmitApplication();

  const isLoading = me.isLoading || appsLoading || formLoading;

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
  if (myApps && myApps.length > 0 && myApps.some((a) => a.status !== "cancelled")) {
    navigate("/convert/status", { replace: true });
    return null;
  }

  // formId 없음
  if (!formId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>전환 신청 폼 ID가 지정되지 않았습니다.</AlertDescription>
      </Alert>
    );
  }

  // 모집 기간 아님 (form.isActive로 판단)
  if (form && !form.isActive) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>현재 즉시 전환 신청 기간이 아닙니다</CardTitle>
          <CardDescription>다음 신청 기간을 기다려주세요.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 폼 로드 실패
  if (!form) {
    return (
      <Alert variant="destructive">
        <AlertDescription>신청 폼을 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          가입비 없음
        </div>
        <DynamicForm
          questions={form.questions}
          onSubmit={(answers) => {
            submitMutation.mutate(
              { formId: form.id, answers },
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
