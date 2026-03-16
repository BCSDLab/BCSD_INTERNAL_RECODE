import { apiClient } from "./client";
import type {
  LinkResponse,
  LinkDetail,
  LinkFiltersResponse,
  LinkFilterParams,
  CreateLinkRequest,
  UpdateLinkRequest,
} from "@/types/link";
import type { PagedResponse } from "@/types/common";

export async function getLinks(
  params: LinkFilterParams,
): Promise<PagedResponse<LinkResponse>> {
  const { data } = await apiClient.get<PagedResponse<LinkResponse>>(
    "/v1/shorten",
    { params },
  );
  return data;
}

export async function getLinkFilters(): Promise<LinkFiltersResponse> {
  const { data } = await apiClient.get<LinkFiltersResponse>(
    "/v1/shorten/filters",
  );
  return data;
}

export async function getLinkDetail(linkId: string): Promise<LinkDetail> {
  const { data } = await apiClient.get<LinkDetail>(`/v1/shorten/${linkId}`);
  return data;
}

export async function createLink(
  body: CreateLinkRequest,
): Promise<LinkResponse> {
  const { data } = await apiClient.post<LinkResponse>("/v1/shorten", body);
  return data;
}

export async function updateLink(
  linkId: string,
  body: UpdateLinkRequest,
): Promise<LinkResponse> {
  const { data } = await apiClient.post<LinkResponse>(
    `/v1/shorten/${linkId}`,
    body,
  );
  return data;
}

export async function toggleLink(linkId: string): Promise<LinkResponse> {
  const { data } = await apiClient.patch<LinkResponse>(
    `/v1/shorten/${linkId}/toggle`,
  );
  return data;
}

export async function deleteLink(linkId: string): Promise<void> {
  await apiClient.delete(`/v1/shorten/${linkId}`);
}
