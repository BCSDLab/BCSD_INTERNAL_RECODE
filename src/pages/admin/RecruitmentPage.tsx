import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForms } from "@/hooks/use-applications";
import { formatDate } from "@/lib/format";
import type { Form } from "@/types/application";

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle className="text-base">{form.title}</CardTitle>
          <Badge variant={form.isActive ? "default" : "outline"}>
            {form.isActive ? "활성" : "비활성"}
          </Badge>
        </div>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">타입</span>
          <span>{form.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">질문 수</span>
          <span>{form.questions.length}개</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">생성일</span>
          <span>{formatDate(form.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">수정일</span>
          <span>{formatDate(form.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecruitmentPage() {
  const [recruitmentId, setRecruitmentId] = useState("");
  const [queryId, setQueryId] = useState("");
  const { data: forms, isLoading, isError } = useForms(queryId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">모집 폼 관리</h1>

      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="recruitmentIdInput">모집 ID</Label>
          <Input
            id="recruitmentIdInput"
            value={recruitmentId}
            onChange={(e) => setRecruitmentId(e.target.value)}
            placeholder="모집 ID를 입력하세요"
            className="w-64"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          onClick={() => setQueryId(recruitmentId)}
        >
          조회
        </button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>폼 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!queryId && (
        <p className="text-sm text-muted-foreground">모집 ID를 입력하고 조회 버튼을 눌러주세요.</p>
      )}

      {forms && forms.length === 0 && (
        <p className="text-sm text-muted-foreground">해당 모집에 등록된 폼이 없습니다.</p>
      )}

      {forms && forms.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}
