import { Link2Off } from "lucide-react";

export function ExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Link2Off className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold">만료된 링크</h1>
        <p className="mt-2 text-muted-foreground">
          이 링크는 만료되어 더 이상 사용할 수 없습니다.
        </p>
      </div>
    </div>
  );
}
