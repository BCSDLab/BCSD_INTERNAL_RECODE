import { useQuery } from "@tanstack/react-query";
import { getMembers, getMember } from "@/api/members";
import type { MemberFilterParams } from "@/types/common";

export function useMembers(filter: MemberFilterParams) {
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
