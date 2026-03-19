import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  allLabel: string;
  options: FilterSelectOption[] | undefined;
  onValueChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({ value, allLabel, options, onValueChange, className }: FilterSelectProps) {
  const allOptions: FilterSelectOption[] = [
    { value: "", label: allLabel },
    ...(options ?? []),
  ];

  const displayLabel = allOptions.find((o) => o.value === value)?.label ?? allLabel;

  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v ?? "")}
    >
      <SelectTrigger className={className ?? "w-36"}>
        <SelectValue placeholder={allLabel}>{displayLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-0 w-(--anchor-width)">
        {allOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
