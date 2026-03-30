import { useLocation, useNavigate } from "react-router-dom";
import { UserPlus, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isHighGrade } from "@/lib/grade";

export function PostRegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const grade = (location.state as { grade?: string })?.grade ?? "";

  const highGrade = isHighGrade(grade);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">가입이 완료되었습니다!</CardTitle>
        <CardDescription>
          {highGrade
            ? "경력이 있으시다면 비기너 과정 없이 바로 합류할 수 있습니다."
            : "BCSD 비기너로 지원해보세요."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {highGrade ? (
          <>
            <Button className="w-full gap-2" onClick={() => navigate("/convert")}>
              <Zap className="h-4 w-4" />
              즉시 전환 신청
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/apply")}>
              <UserPlus className="h-4 w-4" />
              비기너로 지원
            </Button>
          </>
        ) : (
          <>
            <Button className="w-full gap-2" onClick={() => navigate("/apply")}>
              <UserPlus className="h-4 w-4" />
              비기너 지원
            </Button>
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground"
              onClick={() => navigate("/convert")}
            >
              즉시 전환을 원하시면 여기를 클릭하세요
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
