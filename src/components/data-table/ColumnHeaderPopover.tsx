import { useState } from "react";
import {
  ArrowUp, ArrowDown, ListFilter, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SortDirection, ColumnFilterType, EnumFilterOption } from "@/types/data-table";

interface ColumnHeaderPopoverProps {
  header: string;
  sortable?: boolean;
  currentSort?: SortDirection;
  sortPriority?: number;
  onSort?: (direction: SortDirection | null) => void;
  filterType?: ColumnFilterType;
  filterValue?: string;
  filterOptions?: EnumFilterOption[];
  onFilterChange?: (value: string) => void;
}

function SortSection({
  currentSort,
  onSort,
}: {
  currentSort?: SortDirection;
  onSort: (direction: SortDirection | null) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={currentSort === "asc" ? "default" : "ghost"}
        size="sm"
        className="h-6 flex-1 gap-1 text-xs"
        onClick={() => onSort(currentSort === "asc" ? null : "asc")}
      >
        <ArrowUp className="h-3 w-3" />
        오름차순
      </Button>
      <Button
        variant={currentSort === "desc" ? "default" : "ghost"}
        size="sm"
        className="h-6 flex-1 gap-1 text-xs"
        onClick={() => onSort(currentSort === "desc" ? null : "desc")}
      >
        <ArrowDown className="h-3 w-3" />
        내림차순
      </Button>
    </div>
  );
}

function parseMultiValue(value: string): Set<string> {
  if (!value) return new Set();
  return new Set(value.split(","));
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
  const [search, setSearch] = useState("");
  const selected = parseMultiValue(value);

  const filtered = search
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (v: string) => {
    const next = new Set(selected);
    if (next.has(v)) {
      next.delete(v);
    } else {
      next.add(v);
    }
    onChange([...next].join(","));
  };

  return (
    <div className="flex flex-col gap-1">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색..."
        className="h-7 text-xs"
      />
      <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto">
        {filtered.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-0.5 text-xs hover:bg-accent/50"
          >
            <Checkbox
              checked={selected.has(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            {opt.label}
          </label>
        ))}
        {filtered.length === 0 && (
          <span className="px-1.5 py-1 text-xs text-muted-foreground">결과 없음</span>
        )}
      </div>
    </div>
  );
}

function DateFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [from, to] = value ? value.split("~") : ["", ""];
  const [fromInput, setFromInput] = useState(from);
  const [toInput, setToInput] = useState(to);

  const commit = (f: string, t: string) => {
    if (f || t) {
      onChange(`${f}~${t}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={fromInput}
          onChange={(e) => {
            setFromInput(e.target.value);
            commit(e.target.value, toInput);
          }}
          className="h-7 text-xs"
        />
        <span className="text-xs text-muted-foreground">~</span>
        <Input
          type="date"
          value={toInput}
          onChange={(e) => {
            setToInput(e.target.value);
            commit(fromInput, e.target.value);
          }}
          className="h-7 text-xs"
        />
      </div>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground"
          onClick={() => {
            setFromInput("");
            setToInput("");
            onChange("");
          }}
        >
          초기화
        </Button>
      )}
    </div>
  );
}

export function ColumnHeaderPopover({
  header,
  sortable,
  currentSort,
  sortPriority,
  onSort,
  filterType = "none",
  filterValue,
  filterOptions,
  onFilterChange,
}: ColumnHeaderPopoverProps) {
  const [open, setOpen] = useState(false);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground",
          (currentSort || isFilterActive) && "text-foreground",
        )}
      >
        {header}
        <span className="inline-flex w-4 items-center justify-center">
          {currentSort === "asc" && <ArrowUp className="h-3 w-3" />}
          {currentSort === "desc" && <ArrowDown className="h-3 w-3" />}
          {!currentSort && isFilterActive && <ListFilter className="h-3 w-3" />}
          {!currentSort && !isFilterActive && sortable && <ArrowUpDown className="h-3 w-3 opacity-30" />}
        </span>
        {sortPriority && sortPriority > 1 && (
          <span className="text-[10px] text-muted-foreground">{sortPriority}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-48 space-y-1 p-1.5" side="bottom">
        {sortable && onSort && (
          <SortSection currentSort={currentSort} onSort={onSort} />
        )}
        {filterType === "date" && onFilterChange && (
          <DateFilter
            value={filterValue ?? ""}
            onChange={onFilterChange}
          />
        )}
        {hasFilter && filterOptions && filterOptions.length > 0 && onFilterChange && (
          <EnumFilter
            value={filterValue ?? ""}
            options={filterOptions}
            onChange={onFilterChange}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
