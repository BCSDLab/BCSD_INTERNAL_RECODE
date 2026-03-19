import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useSearchParamState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");

  const updateParam = useCallback(
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

  return { searchParams, page, updateParam, setParam, deleteParam };
}
