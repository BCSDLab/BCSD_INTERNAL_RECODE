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

export function applicationStatusLabel(status: string): string {
  switch (status) {
    case "submitted": return "제출 완료";
    case "approved": return "승인";
    case "cancelled": return "취소";
    default: return status;
  }
}

export function applicationStatusVariant(status: string) {
  switch (status) {
    case "approved": return "default" as const;
    case "submitted": return "secondary" as const;
    case "cancelled": return "destructive" as const;
    default: return "secondary" as const;
  }
}
