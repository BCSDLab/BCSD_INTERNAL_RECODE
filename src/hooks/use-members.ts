import { useQuery } from "@tanstack/react-query";
import { getMembersWithFilters, getMember, getMemberFilters } from "@/api/members";
import type { MemberFilterInput } from "@/types/common";

export function useMembersWithFilters(filter: MemberFilterInput) {
  return useQuery({
    queryKey: ["members", filter],
    queryFn: () => getMembersWithFilters(filter),
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
