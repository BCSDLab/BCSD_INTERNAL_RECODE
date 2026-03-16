import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useQrPreview } from "@/hooks/use-qr";
import type { QrParams } from "@/types/qr";

export function QrPage() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [size, setSize] = useState(300);

  const debouncedText = useDebounce(text, 500);
  const textTooLong = text.length > 2000;

  const params: QrParams | null =
    debouncedText && !textTooLong ? { text: debouncedText, format, size } : null;

  const { data, isLoading, isError } = useQrPreview(params);

  const objectUrl = useMemo(
    () => (data ? URL.createObjectURL(data) : null),
    [data],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (isError) {
      toast.error("QR 코드 생성에 실패했습니다.");
    }
  }, [isError]);

  const handleDownload = () => {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `qr.${format}`;
    a.click();
  };

  const handleCopy = async () => {
    if (!data) return;
    try {
      if (format === "png") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": data }),
        ]);
      } else {
        const img = new Image();
        const svgUrl = URL.createObjectURL(data);
        img.src = svgUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(svgUrl);
        const pngBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), "image/png");
        });
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": pngBlob }),
        ]);
      }
      toast.success("클립보드에 복사되었습니다.");
    } catch {
      toast.error("클립보드 복사에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">QR 코드 생성</h1>

      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="qr-text">텍스트 또는 URL</Label>
          <Input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
          />
          {textTooLong && (
            <p className="text-sm text-destructive">
              최대 2000자까지 입력 가능합니다.
            </p>
          )}
        </div>

        <div className="flex gap-6">
          <div className="space-y-2">
            <Label>포맷</Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as "png" | "svg")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="png" id="format-png" />
                <Label htmlFor="format-png">PNG</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="svg" id="format-svg" />
                <Label htmlFor="format-svg">SVG</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-size">크기 (px)</Label>
            <Input
              id="qr-size"
              type="number"
              min={100}
              max={1000}
              step={50}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        {(isLoading || objectUrl) && (
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
            {isLoading ? (
              <Skeleton className="h-[200px] w-[200px]" />
            ) : (
              objectUrl && (
                <img
                  src={objectUrl}
                  alt="QR 코드"
                  className="max-h-[300px] max-w-[300px]"
                />
              )
            )}
            {objectUrl && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" />
                  다운로드
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-1 h-4 w-4" />
                  복사
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
