import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateLink, useUpdateLink } from "@/hooks/use-links";
import type { LinkDetail } from "@/types/link";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: LinkDetail;
}

export function LinkDialog({ open, onOpenChange, editData }: LinkDialogProps) {
  const isEdit = !!editData;
  const createMutation = useCreateLink();
  const updateMutation = useUpdateLink();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <LinkForm
          key={editData?.id ?? "create"}
          editData={editData}
          isEdit={isEdit}
          isPending={createMutation.isPending || updateMutation.isPending}
          onSubmit={(data) => {
            if (isEdit && editData) {
              updateMutation.mutate(
                {
                  linkId: editData.id,
                  body: {
                    title: data.title,
                    description: data.description || undefined,
                    expires_at: data.expires_at || undefined,
                  },
                },
                {
                  onSuccess: () => {
                    toast.success("링크가 수정되었습니다.");
                    onOpenChange(false);
                  },
                },
              );
            } else {
              createMutation.mutate(
                {
                  title: data.title,
                  url: data.url,
                  code: data.code || undefined,
                  description: data.description || undefined,
                  expires_at: data.expires_at || undefined,
                },
                {
                  onSuccess: () => {
                    toast.success("링크가 생성되었습니다.");
                    onOpenChange(false);
                  },
                },
              );
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FormData {
  title: string;
  url: string;
  code: string;
  description: string;
  expires_at: string;
}

function parseDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d;
}

function LinkForm({
  editData,
  isEdit,
  isPending,
  onSubmit,
}: {
  editData?: LinkDetail;
  isEdit: boolean;
  isPending: boolean;
  onSubmit: (data: FormData) => void;
}) {
  const [title, setTitle] = useState(editData?.title ?? "");
  const [url, setUrl] = useState(editData?.url ?? "");
  const [code, setCode] = useState(editData?.code ?? "");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(parseDate(editData?.expires_at));

  const canSubmit = title.trim() && (isEdit || url.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      url: url.trim(),
      code: code.trim(),
      description: description.trim(),
      expires_at: expiresAt ? expiresAt.toISOString() : "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "링크 수정" : "새 링크"}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="링크 제목"
          />
        </div>
        {!isEdit && (
          <>
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">단축 코드</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="자동 생성"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="링크 설명"
          />
        </div>
        <div className="space-y-2">
          <Label>만료일</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                "inline-flex h-9 w-full items-center justify-start rounded-md border border-input bg-transparent px-3 text-sm shadow-xs",
                !expiresAt && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiresAt ? format(expiresAt, "yyyy-MM-dd", { locale: ko }) : "만료일 선택"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={ko}
                selected={expiresAt}
                onSelect={setExpiresAt}
              />
            </PopoverContent>
          </Popover>
          {expiresAt && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setExpiresAt(undefined)}
            >
              <X className="mr-1 h-3 w-3" />
              만료일 제거
            </Button>
          )}
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button type="submit" disabled={!canSubmit || isPending}>
          {isPending ? "저장 중..." : isEdit ? "수정" : "생성"}
        </Button>
      </DialogFooter>
    </form>
  );
}
