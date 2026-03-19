import { gql } from "graphql-request";
import { gqlClient } from "./graphql-client";
import type { MemberResponse, MemberDetail } from "@/types/member";
import type { PagedResponse, MemberFilterInput, MemberFilters } from "@/types/common";

const MEMBERS_WITH_FILTERS_QUERY = gql`
  query MembersWithFilters($filter: MemberFilterInput) {
    members(filter: $filter) {
      items {
        id name email status track paymentStatus department studentId phone
      }
      total page size
    }
    memberFilters {
      tracks statuses paymentStatuses
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

const MEMBER_QUERY = gql`
  query Member($id: ID!) {
    member(id: $id) {
      id name email status track team paymentStatus
      department studentId schoolEmail phone joinDate lastUpdated
    }
  }
`;

interface MembersWithFiltersResult {
  members: PagedResponse<MemberResponse>;
  memberFilters: MemberFilters;
}

export async function getMembersWithFilters(
  filter: MemberFilterInput,
): Promise<MembersWithFiltersResult> {
  return gqlClient.request<MembersWithFiltersResult>(
    MEMBERS_WITH_FILTERS_QUERY,
    { filter },
  );
}

export async function getMemberFilters(): Promise<MemberFilters> {
  const data = await gqlClient.request<{ memberFilters: MemberFilters }>(
    MEMBER_FILTERS_QUERY,
  );
  return data.memberFilters;
}

export async function getMember(memberId: string): Promise<MemberDetail> {
  const data = await gqlClient.request<{ member: MemberDetail }>(
    MEMBER_QUERY,
    { id: memberId },
  );
  return data.member;
}
