import { useState } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Download, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

type Format = "png" | "svg";

export function QrPage() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<Format>("png");
  const [size, setSize] = useState(300);
  const [result, setResult] = useState<{ dataUrl: string; format: Format; blob: Blob } | null>(null);
  const [generating, setGenerating] = useState(false);

  const textTooLong = text.length > 2000;
  const canGenerate = text.trim().length > 0 && !textTooLong;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      if (format === "png") {
        const dataUrl = await QRCode.toDataURL(text.trim(), { width: size, margin: 2 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        setResult({ dataUrl, format, blob });
      } else {
        const svgString = await QRCode.toString(text.trim(), { type: "svg", width: size, margin: 2 });
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const dataUrl = URL.createObjectURL(blob);
        setResult({ dataUrl, format, blob });
      }
    } catch {
      toast.error("QR 코드 생성에 실패했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.dataUrl;
    a.download = `qr.${result.format}`;
    a.click();
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      if (result.format === "png") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": result.blob }),
        ]);
      } else {
        const img = new Image();
        img.src = result.dataUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
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
              onValueChange={(v) => setFormat(v as Format)}
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

        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          className="w-full"
        >
          <QrCode className="mr-1 h-4 w-4" />
          {generating ? "생성 중..." : "QR 코드 생성"}
        </Button>

        {result && (
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
            <img
              src={result.dataUrl}
              alt="QR 코드"
              className="max-h-[300px] max-w-[300px]"
            />
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
          </div>
        )}
      </div>
    </div>
  );
}
