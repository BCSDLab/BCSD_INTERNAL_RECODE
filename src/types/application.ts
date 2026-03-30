export type QuestionType = "short_text" | "long_text" | "multiple_choice" | "checkbox";

export interface FormQuestion {
  id: string;
  type: string;
  label: string;
  required: string;
  options: string[];
  sortOrder: number;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  recruitmentId: string;
  type: string;
  isActive: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions: FormQuestion[];
}

export interface Answer {
  id: string;
  questionId: string;
  value: string;
}

export interface Application {
  id: string;
  formId: string;
  memberId: string;
  status: string;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  updatedAt: string;
  answers: Answer[];
}

export interface SubmitInput {
  formId: string;
  answers: AnswerInput[];
}

export interface AnswerInput {
  questionId: string;
  value: string;
}
