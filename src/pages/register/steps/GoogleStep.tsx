import { GoogleLogin } from "@react-oauth/google";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin } from "@/api/auth";
import { toast } from "sonner";

interface GoogleStepProps {
  onComplete: (googleToken: string) => void;
}

export function GoogleStep({ onComplete }: GoogleStepProps) {
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (credential: string) => {
    setChecking(true);
    setError(false);
    try {
      await postLogin({ google_token: credential });
      // 로그인 성공 = 이미 가입된 계정
      toast.info("이미 가입된 계정입니다. 로그인되었습니다.");
      navigate("/members");
    } catch {
      // 로그인 실패 = 미가입 계정 → 회원가입 진행
      onComplete(credential);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        Google 계정으로 인증해주세요.
      </p>
      <div className="flex justify-center">
        {checking ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            확인 중...
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) {
                handleSuccess(response.credential);
              }
            }}
            onError={() => setError(true)}
            size="large"
            width="300"
          />
        )}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Google 인증에 실패했습니다. 다시 시도해주세요.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
