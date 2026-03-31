import { useReducer } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stepper } from "@/components/common/Stepper";
import { GoogleStep } from "./steps/GoogleStep";
import { ProfileStep } from "./steps/ProfileStep";
import { EmailStep } from "./steps/EmailStep";
import { useRegister } from "@/hooks/use-auth";

const STEPS = ["Google 인증", "정보 입력", "이메일 인증"];

interface WizardState {
  step: number;
  googleToken: string;
  googleName: string;
  name: string;
  department: string;
  studentId: string;
  phone: string;
  grade: string;
  schoolEmail: string;
}

type WizardAction =
  | { type: "SET_GOOGLE"; googleToken: string; googleName: string }
  | { type: "SET_PROFILE"; name: string; department: string; studentId: string; phone: string; grade: string }
  | { type: "SET_EMAIL"; schoolEmail: string }
  | { type: "GO_BACK" };

function decodeGoogleName(token: string): string {
  try {
    const base64 = token.split(".")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return payload.name ?? "";
  } catch {
    return "";
  }
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_GOOGLE":
      return {
        ...state,
        step: 2,
        googleToken: action.googleToken,
        googleName: action.googleName,
      };
    case "SET_PROFILE":
      return { ...state, step: 3, name: action.name, department: action.department, studentId: action.studentId, phone: action.phone, grade: action.grade };
    case "SET_EMAIL":
      return { ...state, schoolEmail: action.schoolEmail };
    case "GO_BACK":
      return { ...state, step: Math.max(1, state.step - 1) };
  }
}

export function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGoogleToken =
    (location.state as { googleToken?: string })?.googleToken ?? "";

  const [state, dispatch] = useReducer(reducer, {
    step: initialGoogleToken ? 2 : 1,
    googleToken: initialGoogleToken,
    googleName: initialGoogleToken
      ? decodeGoogleName(initialGoogleToken)
      : "",
    name: "",
    department: "",
    studentId: "",
    phone: "",
    grade: "",
    schoolEmail: "",
  });

  const register = useRegister();

  const handleEmailComplete = async (email: string) => {
    dispatch({ type: "SET_EMAIL", schoolEmail: email });
    try {
      await register.mutateAsync({
        google_token: state.googleToken,
        name: state.name,
        department: state.department,
        student_id: state.studentId,
        school_email: email,
        phone: state.phone,
        grade: state.grade,
      });
      navigate("/post-register", { state: { grade: state.grade } });
    } catch {
      // onError in useRegister handles "already registered"
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="px-6 pt-6">
        <Alert className="border-amber-500/50 text-amber-700 [&>svg]:text-amber-600">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>
            BCSD에서 계속 사용할 Google 계정으로 가입해주세요.
            다른 계정으로 가입하면 나중에 변경이 어렵습니다.
          </AlertDescription>
        </Alert>
      </div>
      <CardHeader>
        <Stepper steps={STEPS} currentStep={state.step} />
      </CardHeader>
      <CardContent>
        {state.step === 1 && (
          <GoogleStep
            onComplete={(token) =>
              dispatch({
                type: "SET_GOOGLE",
                googleToken: token,
                googleName: decodeGoogleName(token),
              })
            }
          />
        )}
        {state.step === 2 && (
          <ProfileStep
            defaultName={state.name || state.googleName}
            onBack={() => dispatch({ type: "GO_BACK" })}
            onComplete={(name, department, studentId, phone, grade) =>
              dispatch({ type: "SET_PROFILE", name, department, studentId, phone, grade })
            }
          />
        )}
        {state.step === 3 && (
          <EmailStep
            onBack={() => dispatch({ type: "GO_BACK" })}
            onComplete={handleEmailComplete}
          />
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to="/login"
          className="text-sm text-muted-foreground hover:underline"
        >
          이미 계정이 있으신가요? 로그인
        </Link>
      </CardFooter>
    </Card>
  );
}
