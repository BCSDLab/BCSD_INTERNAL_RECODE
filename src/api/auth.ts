import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  VerifyEmailRequest,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
  RegisterRequest,
  MessageResponse,
} from "@/types/auth";

export async function postLogin(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/v1/auth/login", body);
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>("/v1/auth/me");
  return data;
}

export async function postLogout(): Promise<void> {
  await apiClient.post("/v1/auth/logout");
}

export async function postVerifyEmail(
  body: VerifyEmailRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    "/v1/auth/verify-email",
    body,
  );
  return data;
}

export async function postConfirmEmail(
  body: ConfirmEmailRequest,
): Promise<ConfirmEmailResponse> {
  const { data } = await apiClient.post<ConfirmEmailResponse>(
    "/v1/auth/confirm-email",
    body,
  );
  return data;
}

export async function postRegister(
  body: RegisterRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/v1/auth/register",
    body,
  );
  return data;
}
