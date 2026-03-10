import { GoogleLogin } from "@react-oauth/google";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface GoogleStepProps {
  onComplete: (googleToken: string) => void;
}

export function GoogleStep({ onComplete }: GoogleStepProps) {
  const [error, setError] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        Google 계정으로 인증해주세요.
      </p>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(response) => {
            if (response.credential) {
              onComplete(response.credential);
            }
          }}
          onError={() => setError(true)}
          size="large"
          width="300"
        />
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
