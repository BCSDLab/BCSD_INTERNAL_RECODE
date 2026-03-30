import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyApplication,
  getFormTemplate,
  getRecruitmentPeriod,
  submitApplication,
  cancelApplication,
  getApplications,
  approveApplication,
  batchApproveApplications,
} from "@/api/applications";

export function useMyApplication() {
  return useQuery({
    queryKey: ["myApplication"],
    queryFn: getMyApplication,
  });
}

export function useFormTemplate(type: "beginner" | "conversion") {
  return useQuery({
    queryKey: ["formTemplate", type],
    queryFn: () => getFormTemplate(type),
  });
}

export function useRecruitmentPeriod(type: "beginner" | "conversion") {
  return useQuery({
    queryKey: ["recruitmentPeriod", type],
    queryFn: () => getRecruitmentPeriod(type),
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplication"] });
    },
  });
}

export function useCancelApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplication"] });
    },
  });
}

export function useApplications(filter: Record<string, unknown>) {
  return useQuery({
    queryKey: ["applications", filter],
    queryFn: () => getApplications(filter),
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useBatchApproveApplications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: batchApproveApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
