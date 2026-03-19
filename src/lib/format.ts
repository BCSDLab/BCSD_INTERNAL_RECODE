export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function statusVariant(status: string) {
  switch (status) {
    case "Regular": return "default" as const;
    case "Beginner": return "secondary" as const;
    case "Mentor": return "outline" as const;
    default: return "secondary" as const;
  }
}