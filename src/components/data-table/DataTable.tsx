import { useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { ColumnHeaderPopover } from "./ColumnHeaderPopover";
import type { ColumnDef, SortItem, SortDirection, EnumFilterOption } from "@/types/data-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[] | undefined;
  isLoading?: boolean;
  sorts: SortItem[];
  filters: Record<string, string>;
  onSort: (field: string, direction: SortDirection | null) => void;
  onFilterChange: (key: string, value: string) => void;
  onRowClick?: (row: TData) => void;
  rowKey: (row: TData) => string;
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  sorts,
  filters,
  onSort,
  onFilterChange,
  onRowClick,
  rowKey,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<TData>) {
  // 각 컬럼의 고유값을 현재 데이터에서 추출 (filterOptions 미제공 시)
  const autoOptions = useMemo(() => {
    if (!data) return {};
    const result: Record<string, EnumFilterOption[]> = {};
    for (const col of columns) {
      if (!col.filterType || col.filterType === "none" || col.filterOptions) continue;
      const values = new Set<string>();
      for (const row of data) {
        const raw = (row as Record<string, unknown>)[col.id];
        if (raw != null && raw !== "") values.add(String(raw));
      }
      result[col.id] = [...values].sort().map((v) => ({ value: v, label: v }));
    }
    return result;
  }, [data, columns]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {columns.map((col) => {
              const sortIdx = sorts.findIndex((s) => s.field === col.id);
              const currentSort = sortIdx !== -1 ? sorts[sortIdx].direction : undefined;
              const filterKey = col.filterParamKey ?? col.id;
              const options = col.filterOptions ?? autoOptions[col.id];

              return (
                <TableHead key={col.id} className={`group/th ${col.className ?? ""}`}>
                  <ColumnHeaderPopover
                    header={col.header}
                    sortable={col.sortable}
                    currentSort={currentSort}
                    sortPriority={sortIdx !== -1 ? sortIdx + 1 : undefined}
                    onSort={(dir) => onSort(col.id, dir)}
                    filterType={col.filterType}
                    filterValue={filters[filterKey]}
                    filterOptions={options}
                    onFilterChange={(v) => onFilterChange(filterKey, v)}
                  />
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={columns.length} />
          ) : data && data.length > 0 ? (
            data.map((row) => (
              <TableRow
                key={rowKey(row)}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <TableCell key={col.id}>{col.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
