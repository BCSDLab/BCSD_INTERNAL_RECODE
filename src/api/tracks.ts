import { apiClient } from "./client";
import type { FilterOptions } from "@/types/common";

export async function getFilterOptions(): Promise<FilterOptions> {
  const { data } = await apiClient.get<FilterOptions>("/v1/members/filters");
  return data;
}
