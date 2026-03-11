import { useReducer } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Stepper } from "@/components/common/Stepper";
import { GoogleStep } from "./steps/GoogleStep";
import { ProfileStep } from "./steps/ProfileStep";
import { EmailStep } from "./steps/EmailStep";
import { TrackStep } from "./steps/TrackStep";
import { useRegister } from "@/hooks/use-auth";

const STEPS = ["Google 인증", "정보 입력", "이메일 인증", "트랙 선택"];

interface WizardState {
  step: number;
  googleToken: string;
  googleName: string;
  name: string;
  department: string;
  studentId: string;
  phone: string;
  schoolEmail: string;
  track: string;
}

type WizardAction =
  | { type: "SET_GOOGLE"; googleToken: string; googleName: string }
  | { type: "SET_PROFILE"; name: string; department: string; studentId: string; phone: string }
  | { type: "SET_EMAIL"; schoolEmail: string }
  | { type: "SET_TRACK"; track: string }
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
      return { ...state, step: 3, name: action.name, department: action.department, studentId: action.studentId, phone: action.phone };
    case "SET_EMAIL":
      return { ...state, step: 4, schoolEmail: action.schoolEmail };
    case "SET_TRACK":
      return { ...state, track: action.track };
    case "GO_BACK":
      return { ...state, step: Math.max(1, state.step - 1) };
  }
}

export function RegisterPage() {
  const location = useLocation();
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
    schoolEmail: "",
    track: "",
  });

  const register = useRegister();

  const handleTrackComplete = (track: string) => {
    dispatch({ type: "SET_TRACK", track });
    register.mutate({
      google_token: state.googleToken,
      name: state.name,
      department: state.department,
      student_id: state.studentId,
      school_email: state.schoolEmail,
      phone: state.phone,
      track,
    });
  };

  return (
    <Card className="w-full max-w-md">
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
            onComplete={(name, department, studentId, phone) =>
              dispatch({ type: "SET_PROFILE", name, department, studentId, phone })
            }
          />
        )}
        {state.step === 3 && (
          <EmailStep
            onBack={() => dispatch({ type: "GO_BACK" })}
            onComplete={(email) =>
              dispatch({ type: "SET_EMAIL", schoolEmail: email })
            }
          />
        )}
        {state.step === 4 && (
          <TrackStep
            onBack={() => dispatch({ type: "GO_BACK" })}
            onComplete={handleTrackComplete}
            isPending={register.isPending}
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
