import { cn } from "@/lib/utils";

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailRow({ label, children, className }: DetailRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className={cn("col-span-2 text-sm", className)}>{children}</dd>
    </div>
  );
}
