import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { ColumnHeaderPopover } from "./ColumnHeaderPopover";
import type { ColumnDef, SortItem, SortDirection } from "@/types/data-table";

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
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => {
              const sortIdx = sorts.findIndex((s) => s.field === col.id);
              const currentSort = sortIdx !== -1 ? sorts[sortIdx].direction : undefined;
              const filterKey = col.filterParamKey ?? col.id;

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
                    filterOptions={col.filterOptions}
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
