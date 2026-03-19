export type SortDirection = "asc" | "desc";

export interface SortItem {
  field: string;
  direction: SortDirection;
}

export type ColumnFilterType = "enum" | "text" | "date" | "none";

export interface EnumFilterOption {
  value: string;
  label: string;
}

export interface ColumnDef<TData> {
  id: string;
  header: string;
  cell: (row: TData) => React.ReactNode;
  sortable?: boolean;
  filterType?: ColumnFilterType;
  /** URL param key (defaults to id) */
  filterParamKey?: string;
  filterOptions?: EnumFilterOption[];
  className?: string;
}
