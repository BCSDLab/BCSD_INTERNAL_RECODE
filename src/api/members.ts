import { gql } from "graphql-request";
import { gqlClient } from "./graphql-client";
import type { MemberResponse, MemberDetail } from "@/types/member";
import type { PagedResponse, MemberFilterInput, MemberFilters } from "@/types/common";

const MEMBERS_QUERY = gql`
  query Members($filter: MemberFilterInput) {
    members(filter: $filter) {
      items {
        id name email status track team paymentStatus
      }
      total page size
    }
  }
`;

const MEMBER_QUERY = gql`
  query Member($id: ID!) {
    member(id: $id) {
      id name email status track team paymentStatus
      department studentId schoolEmail phone joinDate lastUpdated
    }
  }
`;

const MEMBER_FILTERS_QUERY = gql`
  query MemberFilters {
    memberFilters {
      tracks statuses paymentStatuses
    }
  }
`;

export async function getMembers(
  filter: MemberFilterInput,
): Promise<PagedResponse<MemberResponse>> {
  const data = await gqlClient.request<{ members: PagedResponse<MemberResponse> }>(
    MEMBERS_QUERY,
    { filter },
  );
  return data.members;
}

export async function getMember(memberId: string): Promise<MemberDetail> {
  const data = await gqlClient.request<{ member: MemberDetail }>(
    MEMBER_QUERY,
    { id: memberId },
  );
  return data.member;
}

export async function getMemberFilters(): Promise<MemberFilters> {
  const data = await gqlClient.request<{ memberFilters: MemberFilters }>(
    MEMBER_FILTERS_QUERY,
  );
  return data.memberFilters;
}
