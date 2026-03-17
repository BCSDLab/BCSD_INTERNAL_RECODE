import { useState } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

const LOGO_PATH = "/BCSD-symbol.svg";

type Format = "png" | "svg";

interface QrResult {
  dataUrl: string;
  format: Format;
  blob: Blob;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

interface QrColors {
  dark: string;
  light: string;
}

async function renderQrToCanvas(
  text: string,
  size: number,
  withLogo: boolean,
  colors: QrColors,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    errorCorrectionLevel: withLogo ? "H" : "M",
    color: { dark: colors.dark, light: colors.light },
  });

  if (withLogo) {
    const ctx = canvas.getContext("2d")!;
    try {
      const logo = await loadImage(LOGO_PATH);
      const logoSize = size * 0.2;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      const padding = logoSize * 0.15;
      ctx.fillStyle = colors.light;
      ctx.beginPath();
      ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 6);
      ctx.fill();
      ctx.drawImage(logo, x, y, logoSize, logoSize);
    } catch {
      // 로고 로드 실패 시 QR만 표시
    }
  }

  return canvas;
}

async function generatePng(text: string, size: number, withLogo: boolean, colors: QrColors): Promise<QrResult> {
  const canvas = await renderQrToCanvas(text, size, withLogo, colors);
  const dataUrl = canvas.toDataURL("image/png");
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), "image/png");
  });
  return { dataUrl, format: "png", blob };
}

async function generateSvg(text: string, size: number, colors: QrColors): Promise<QrResult> {
  const svgString = await QRCode.toString(text, { type: "svg", width: size, margin: 2, color: { dark: colors.dark, light: colors.light } });
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const dataUrl = URL.createObjectURL(blob);
  return { dataUrl, format: "svg", blob };
}

export function QrPage() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<Format>("png");
  const [size, setSize] = useState(300);
  const [withLogo, setWithLogo] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [result, setResult] = useState<QrResult | null>(null);
  const [generating, setGenerating] = useState(false);

  const textTooLong = text.length > 2000;
  const canGenerate = text.trim().length > 0 && !textTooLong;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      const trimmed = text.trim();
      const colors: QrColors = { dark: fgColor, light: bgColor };
      if (format === "png") {
        setResult(await generatePng(trimmed, size, withLogo, colors));
      } else {
        setResult(await generateSvg(trimmed, size, colors));
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
        const img = await loadImage(result.dataUrl);
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

      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="qr-text">텍스트 또는 URL</Label>
            <Input
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || generating}
            >
              <QrCode className="mr-1 h-4 w-4" />
              {generating ? "생성 중..." : "생성"}
            </Button>
          </div>
        </div>
        {textTooLong && (
          <p className="text-sm text-destructive">
            최대 2000자까지 입력 가능합니다.
          </p>
        )}

        <Separator />

        <div className="flex flex-wrap items-end gap-6">
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={withLogo}
                onChange={(e) => setWithLogo(e.target.checked)}
                disabled={format === "svg"}
                className="accent-primary h-4 w-4"
              />
              BCSD 로고 삽입
            </Label>
            {format === "svg" && withLogo && (
              <p className="text-xs text-muted-foreground">SVG에는 로고를 삽입할 수 없습니다.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-fg">QR 색상</Label>
            <div className="flex items-center gap-2">
              <input
                id="qr-fg"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border"
              />
              <span className="text-xs text-muted-foreground">{fgColor}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-bg">배경 색상</Label>
            <div className="flex items-center gap-2">
              <input
                id="qr-bg"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border"
              />
              <span className="text-xs text-muted-foreground">{bgColor}</span>
            </div>
          </div>
        </div>

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
