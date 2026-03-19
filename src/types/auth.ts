export interface LoginRequest {
  google_token: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface MeMember {
  name: string;
  status: string;
  track: string;
}

export interface MeResponse {
  id: string;
  email: string;
  member: MeMember;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface ConfirmEmailRequest {
  email: string;
  code: string;
}

export interface ConfirmEmailResponse {
  verified: boolean;
}

export interface RegisterRequest {
  google_token: string;
  name: string;
  department: string;
  student_id: string;
  school_email: string;
  phone: string;
  track: string;
}

export interface MessageResponse {
  message: string;
}
