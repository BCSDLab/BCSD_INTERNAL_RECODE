import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortItem, SortDirection } from "@/types/data-table";

function parseSorts(raw: string): SortItem[] {
  if (!raw) return [];
  return raw.split(",").reduce<SortItem[]>((acc, part) => {
    const [field, dir] = part.split(":");
    if (field && (dir === "asc" || dir === "desc")) {
      acc.push({ field, direction: dir as SortDirection });
    }
    return acc;
  }, []);
}

function serializeSorts(sorts: SortItem[]): string {
  return sorts.map((s) => `${s.field}:${s.direction}`).join(",");
}

export function useTableState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const sorts = parseSorts(searchParams.get("sort") ?? "");

  const getFilters = useCallback(
    (keys: string[]): Record<string, string> => {
      const result: Record<string, string> = {};
      for (const key of keys) {
        const val = searchParams.get(key);
        if (val) result[key] = val;
      }
      return result;
    },
    [searchParams],
  );

  const setSort = useCallback(
    (field: string, direction: SortDirection | null) => {
      const next = new URLSearchParams(searchParams);
      const currentSorts = parseSorts(next.get("sort") ?? "");
      const idx = currentSorts.findIndex((s) => s.field === field);

      if (direction === null) {
        if (idx !== -1) currentSorts.splice(idx, 1);
      } else if (idx === -1) {
        currentSorts.push({ field, direction });
      } else {
        currentSorts[idx].direction = direction;
      }

      const serialized = serializeSorts(currentSorts);
      if (serialized) {
        next.set("sort", serialized);
      } else {
        next.delete("sort");
      }
      next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const setPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(p));
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams);
      next.set(key, value);
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const deleteParam = useCallback(
    (key: string) => {
      const next = new URLSearchParams(searchParams);
      next.delete(key);
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const primarySort = sorts.length > 0
    ? { sortBy: sorts[0].field, sortOrder: sorts[0].direction }
    : undefined;

  return {
    searchParams,
    page,
    sorts,
    getFilters,
    setSort,
    setFilter,
    setPage,
    setParam,
    deleteParam,
    primarySort,
  };
}
