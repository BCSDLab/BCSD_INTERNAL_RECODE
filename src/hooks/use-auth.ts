import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  postLogin,
  postVerifyEmail,
  postConfirmEmail,
  postRegister,
  getMe,
  postLogout,
} from "@/api/auth";

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
    onSuccess: () => {
      navigate("/members");
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
