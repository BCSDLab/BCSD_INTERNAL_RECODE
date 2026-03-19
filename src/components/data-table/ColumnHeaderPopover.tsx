import { useState } from "react";
import {
  ArrowUp, ArrowDown, X, ListFilter, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { SortDirection, ColumnFilterType, EnumFilterOption } from "@/types/data-table";

interface ColumnHeaderPopoverProps {
  header: string;
  sortable?: boolean;
  currentSort?: SortDirection;
  sortPriority?: number;
  onToggleSort?: () => void;
  filterType?: ColumnFilterType;
  filterValue?: string;
  filterOptions?: EnumFilterOption[];
  onFilterChange?: (value: string) => void;
}

function SortSection({
  currentSort,
  onToggleSort,
}: {
  currentSort?: SortDirection;
  onToggleSort: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={currentSort === "asc" ? "default" : "ghost"}
        size="sm"
        className="h-7 flex-1 gap-1 text-xs"
        onClick={onToggleSort}
      >
        <ArrowUp className="h-3 w-3" />
        오름차순
      </Button>
      <Button
        variant={currentSort === "desc" ? "default" : "ghost"}
        size="sm"
        className="h-7 flex-1 gap-1 text-xs"
        onClick={onToggleSort}
      >
        <ArrowDown className="h-3 w-3" />
        내림차순
      </Button>
      {currentSort && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onToggleSort}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function EnumFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: EnumFilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        className={cn(
          "rounded px-2 py-1 text-left text-xs",
          !value ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        )}
        onClick={() => onChange("")}
      >
        전체
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(
            "rounded px-2 py-1 text-left text-xs",
            value === opt.value ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
          )}
          onClick={() => onChange(value === opt.value ? "" : opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TextFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [input, setInput] = useState(value);
  const debouncedInput = useDebounce(input, 300);

  // Sync debounced value to parent
  if (debouncedInput !== value) {
    onChange(debouncedInput);
  }

  return (
    <Input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="검색..."
      className="h-7 text-xs"
    />
  );
}

export function ColumnHeaderPopover({
  header,
  sortable,
  currentSort,
  sortPriority,
  onToggleSort,
  filterType = "none",
  filterValue,
  filterOptions,
  onFilterChange,
}: ColumnHeaderPopoverProps) {
  const hasFilter = filterType !== "none";
  const isFilterActive = !!filterValue;
  const showPopover = sortable || hasFilter;

  if (!showPopover) {
    return (
      <span className="text-xs font-medium text-muted-foreground">
        {header}
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground",
          (currentSort || isFilterActive) && "text-foreground",
        )}
      >
        {header}
        {currentSort === "asc" && <ArrowUp className="h-3 w-3" />}
        {currentSort === "desc" && <ArrowDown className="h-3 w-3" />}
        {sortPriority && sortPriority > 1 && (
          <span className="text-[10px] text-muted-foreground">{sortPriority}</span>
        )}
        {!currentSort && isFilterActive && <ListFilter className="h-3 w-3" />}
        {!currentSort && !isFilterActive && sortable && <ArrowUpDown className="h-3 w-3 opacity-0 group-hover/th:opacity-50" />}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2" side="bottom">
        {sortable && onToggleSort && (
          <SortSection currentSort={currentSort} onToggleSort={onToggleSort} />
        )}
        {sortable && hasFilter && <Separator className="my-2" />}
        {filterType === "enum" && filterOptions && onFilterChange && (
          <EnumFilter
            value={filterValue ?? ""}
            options={filterOptions}
            onChange={onFilterChange}
          />
        )}
        {filterType === "text" && onFilterChange && (
          <TextFilter
            value={filterValue ?? ""}
            onChange={onFilterChange}
          />
        )}
        {filterType === "date" && (
          <p className="text-xs text-muted-foreground">날짜 필터 (준비 중)</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
