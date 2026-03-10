import { useQuery } from "@tanstack/react-query";
import { getFilterOptions } from "@/api/tracks";

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: getFilterOptions,
    staleTime: Infinity,
  });
}
