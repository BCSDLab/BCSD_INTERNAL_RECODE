import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLinks,
  getLinkFilters,
  getLinkDetail,
  createLink,
  updateLink,
  toggleLink,
  deleteLink,
} from "@/api/links";
import type { LinkFilterParams, UpdateLinkRequest } from "@/types/link";

export function useLinks(filter: LinkFilterParams) {
  return useQuery({
    queryKey: ["links", filter],
    queryFn: () => getLinks(filter),
  });
}

export function useLinkDetail(linkId: string | null) {
  return useQuery({
    queryKey: ["links", linkId],
    queryFn: () => getLinkDetail(linkId!),
    enabled: !!linkId,
  });
}

export function useLinkFilters() {
  return useQuery({
    queryKey: ["linkFilters"],
    queryFn: getLinkFilters,
    staleTime: Infinity,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, body }: { linkId: string; body: UpdateLinkRequest }) =>
      updateLink(linkId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useToggleLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}
