import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/hooks/use-auth";
import type { ApiError } from "@/types/common";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;

    login.mutate(
      { google_token: credentialResponse.credential },
      {
        onError: (error) => {
          const apiError = error as unknown as ApiError;
          if (apiError.message?.includes("registration required")) {
            navigate("/register", {
              state: { googleToken: credentialResponse.credential },
            });
          }
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">BCSD</CardTitle>
        <CardDescription>내부 관리 시스템</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {login.isPending ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            로그인 중...
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => login.reset()}
            size="large"
            width="300"
          />
        )}
      </CardContent>
      {login.isError && (
        <CardFooter>
          <Alert variant="destructive" className="w-full">
            <AlertDescription>
              로그인에 실패했습니다. 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
