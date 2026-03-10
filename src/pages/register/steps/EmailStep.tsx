import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVerifyEmail, useConfirmEmail } from "@/hooks/use-auth";

interface EmailStepProps {
  onBack: () => void;
  onComplete: (schoolEmail: string) => void;
}

export function EmailStep({ onBack, onComplete }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const verifyEmail = useVerifyEmail();
  const confirmEmail = useConfirmEmail();

  const handleSendCode = () => {
    verifyEmail.mutate(
      { email },
      { onSuccess: () => setCodeSent(true) },
    );
  };

  const handleConfirmCode = () => {
    confirmEmail.mutate(
      { email, code },
      {
        onSuccess: (data) => {
          if (data.verified) {
            onComplete(email);
          }
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        학교 이메일을 인증해주세요.
      </p>
      <div className="space-y-2">
        <Label htmlFor="school-email">학교 이메일</Label>
        <div className="flex gap-2">
          <Input
            id="school-email"
            type="email"
            placeholder="example@koreatech.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={codeSent}
          />
          <Button
            onClick={handleSendCode}
            disabled={!email || verifyEmail.isPending || codeSent}
          >
            {verifyEmail.isPending ? "전송 중..." : codeSent ? "전송됨" : "인증코드 전송"}
          </Button>
        </div>
      </div>

      {codeSent && (
        <div className="space-y-2">
          <Label htmlFor="verify-code">인증코드</Label>
          <div className="flex gap-2">
            <Input
              id="verify-code"
              placeholder="6자리 코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
            />
            <Button
              onClick={handleConfirmCode}
              disabled={code.length !== 6 || confirmEmail.isPending}
            >
              {confirmEmail.isPending ? "확인 중..." : "확인"}
            </Button>
          </div>
        </div>
      )}

      {verifyEmail.isError && (
        <Alert variant="destructive">
          <AlertDescription>이메일 전송에 실패했습니다.</AlertDescription>
        </Alert>
      )}
      {confirmEmail.isError && (
        <Alert variant="destructive">
          <AlertDescription>인증코드가 올바르지 않습니다.</AlertDescription>
        </Alert>
      )}

      <Button variant="ghost" className="w-full gap-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        이전 단계
      </Button>
    </div>
  );
}
