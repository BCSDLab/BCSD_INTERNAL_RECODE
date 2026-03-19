import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const ALL_SENTINEL = "__ALL__";

interface FilterSelectProps {
  value: string;
  allLabel: string;
  options: { value: string; label: string }[] | undefined;
  onValueChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({ value, allLabel, options, onValueChange, className }: FilterSelectProps) {
  return (
    <Select
      value={value || ALL_SENTINEL}
      onValueChange={(v) => onValueChange(v === ALL_SENTINEL ? "" : v ?? "")}
    >
      <SelectTrigger className={className ?? "w-36"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-0 w-(--anchor-width)">
        <SelectItem value={ALL_SENTINEL}>{allLabel}</SelectItem>
        {options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
