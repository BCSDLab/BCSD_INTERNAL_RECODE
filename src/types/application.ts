export type QuestionType = "short_text" | "long_text" | "multiple_choice" | "checkbox";

export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface FormTemplate {
  id: string;
  type: "beginner" | "conversion";
  questions: FormQuestion[];
  updatedAt: string;
}

export interface ApplicationAnswer {
  questionId: string;
  value: string | string[];
}

export interface ApplicationSubmission {
  formTemplateId: string;
  answers: ApplicationAnswer[];
  track: string;
}

export type ApplicationStatus = "pending_payment" | "paid" | "approved" | "cancelled";

export interface PaymentInfo {
  bank: string;
  account: string;
  amount: number;
  holder: string;
}

export interface MyApplication {
  id: string;
  status: ApplicationStatus;
  formTemplateId: string;
  answers: ApplicationAnswer[];
  track: string;
  submittedAt: string;
  paymentInfo?: PaymentInfo;
}

export interface RecruitmentPeriod {
  id: string;
  type: "beginner" | "conversion";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ApplicationListItem {
  id: string;
  applicantName: string;
  applicantEmail: string;
  track: string;
  status: ApplicationStatus;
  submittedAt: string;
}
