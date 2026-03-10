import { apiClient } from "./client";
import type { MemberDetail } from "@/types/member";
import type { MemberResponse } from "@/types/member";
import type { PagedResponse, MemberFilterParams } from "@/types/common";

export async function getMembers(
  params: MemberFilterParams,
): Promise<PagedResponse<MemberResponse>> {
  const { data } = await apiClient.get<PagedResponse<MemberResponse>>(
    "/v1/members",
    { params },
  );
  return data;
}

export async function getMember(memberId: string): Promise<MemberDetail> {
  const { data } = await apiClient.get<MemberDetail>(
    `/v1/members/${memberId}`,
  );
  return data;
}
