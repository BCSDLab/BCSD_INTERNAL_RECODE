import { gql } from "graphql-request";
import { gqlClient } from "./graphql-client";
import type {
  Link,
  LinkDetail,
  LinkFilters,
  LinkFilterInput,
  CreateLinkInput,
  UpdateLinkInput,
} from "@/types/link";
import type { PagedResponse } from "@/types/common";

const LINK_FIELDS = `id code title url creatorId createdAt updatedAt description expiresAt expiredAt`;

const LINKS_QUERY = gql`
  query Links($filter: LinkFilterInput) {
    links(filter: $filter) {
      items { ${LINK_FIELDS} }
      total page size
    }
  }
`;

const LINK_QUERY = gql`
  query Link($id: ID!) {
    link(id: $id) {
      ${LINK_FIELDS}
      totalClicks
      dailyClicks { date count }
    }
  }
`;

const LINK_FILTERS_QUERY = gql`
  query LinkFilters {
    linkFilters {
      creators { id name }
      expired
    }
  }
`;

const CREATE_LINK = gql`
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) { ${LINK_FIELDS} }
  }
`;

const UPDATE_LINK = gql`
  mutation UpdateLink($id: ID!, $input: UpdateLinkInput!) {
    updateLink(id: $id, input: $input) { ${LINK_FIELDS} }
  }
`;

const TOGGLE_LINK = gql`
  mutation ToggleLink($id: ID!) {
    toggleLink(id: $id) { ${LINK_FIELDS} }
  }
`;

const DELETE_LINK = gql`
  mutation DeleteLink($id: ID!) {
    deleteLink(id: $id)
  }
`;

export async function getLinks(
  filter: LinkFilterInput,
): Promise<PagedResponse<Link>> {
  const data = await gqlClient.request<{ links: PagedResponse<Link> }>(
    LINKS_QUERY,
    { filter },
  );
  return data.links;
}

export async function getLinkFilters(): Promise<LinkFilters> {
  const data = await gqlClient.request<{ linkFilters: LinkFilters }>(
    LINK_FILTERS_QUERY,
  );
  return data.linkFilters;
}

export async function getLinkDetail(linkId: string): Promise<LinkDetail> {
  const data = await gqlClient.request<{ link: LinkDetail }>(
    LINK_QUERY,
    { id: linkId },
  );
  return data.link;
}

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const data = await gqlClient.request<{ createLink: Link }>(
    CREATE_LINK,
    { input },
  );
  return data.createLink;
}

export async function updateLink(
  linkId: string,
  input: UpdateLinkInput,
): Promise<Link> {
  const data = await gqlClient.request<{ updateLink: Link }>(
    UPDATE_LINK,
    { id: linkId, input },
  );
  return data.updateLink;
}

export async function toggleLink(linkId: string): Promise<Link> {
  const data = await gqlClient.request<{ toggleLink: Link }>(
    TOGGLE_LINK,
    { id: linkId },
  );
  return data.toggleLink;
}

export async function deleteLink(linkId: string): Promise<boolean> {
  const data = await gqlClient.request<{ deleteLink: boolean }>(
    DELETE_LINK,
    { id: linkId },
  );
  return data.deleteLink;
}
