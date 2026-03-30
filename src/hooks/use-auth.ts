import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  postLogin,
  postVerifyEmail,
  postConfirmEmail,
  postRegister,
  getMe,
  postLogout,
} from "@/api/auth";
import type { ApiError } from "@/types/common";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      navigate("/members");
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: postVerifyEmail,
  });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: postConfirmEmail,
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postRegister,
    onError: (error) => {
      const apiError = error as unknown as ApiError;
      if (apiError.message?.includes("already registered")) {
        toast.error("이미 가입된 계정입니다.");
        navigate("/login");
      }
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}
