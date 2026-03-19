import { useQuery } from "@tanstack/react-query";
import { getMembers, getMember, getMemberFilters } from "@/api/members";
import type { MemberFilterInput } from "@/types/common";

export function useMembers(filter: MemberFilterInput) {
  return useQuery({
    queryKey: ["members", filter],
    queryFn: () => getMembers(filter),
  });
}

export function useMember(memberId: string) {
  return useQuery({
    queryKey: ["members", memberId],
    queryFn: () => getMember(memberId),
    enabled: !!memberId,
  });
}

export function useMemberFilters() {
  return useQuery({
    queryKey: ["memberFilters"],
    queryFn: getMemberFilters,
    staleTime: Infinity,
  });
}
