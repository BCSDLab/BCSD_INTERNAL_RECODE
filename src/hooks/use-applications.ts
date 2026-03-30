import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getForm,
  getForms,
  getMyApplications,
  getApplications,
  getApplication,
  submitApplication,
  approveApplications,
  cancelApplication,
} from "@/api/applications";

export function useForm(id: string) {
  return useQuery({
    queryKey: ["form", id],
    queryFn: () => getForm(id),
    enabled: !!id,
  });
}

export function useForms(recruitmentId: string) {
  return useQuery({
    queryKey: ["forms", recruitmentId],
    queryFn: () => getForms(recruitmentId),
    enabled: !!recruitmentId,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });
}

export function useApplications(formId: string) {
  return useQuery({
    queryKey: ["applications", formId],
    queryFn: () => getApplications(formId),
    enabled: !!formId,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
    enabled: !!id,
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

export function useApproveApplications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useCancelApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}
