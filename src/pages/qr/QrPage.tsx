import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

const LOGO_PATH = "/BCSD-symbol.svg";

type Format = "png" | "svg";

interface QrColors {
  dark: string;
  light: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// --- SVG 생성 (미리보기 + SVG 다운로드 공용) ---

async function buildSvgString(text: string, size: number, withLogo: boolean, colors: QrColors): Promise<string> {
  const svgString = await QRCode.toString(text, {
    type: "svg",
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: colors.dark, light: colors.light },
  });

  if (!withLogo) return svgString;

  try {
    const logoSvg = await (await fetch(LOGO_PATH)).text();

    const vbMatch = svgString.match(/viewBox="0 0 (\d+) (\d+)"/);
    const vbSize = vbMatch ? Number(vbMatch[1]) : size;

    const logoVbMatch = logoSvg.match(/viewBox="([^"]*)"/);
    const logoVb = logoVbMatch ? logoVbMatch[1].split(/\s+/).map(Number) : [0, 0, 100, 100];
    const logoNatW = logoVb[2] - logoVb[0];
    const logoNatH = logoVb[3] - logoVb[1];
    const ratio = logoNatW / logoNatH;

    const boxSize = vbSize * 0.26;
    const pad = boxSize * 0.02;
    const totalBox = boxSize + pad * 2;
    const bx = (vbSize - totalBox) / 2;
    const by = (vbSize - totalBox) / 2;
    const rx = 6 * (vbSize / size);

    const lw = ratio >= 1 ? boxSize : boxSize * ratio;
    const lh = ratio >= 1 ? boxSize / ratio : boxSize;
    const lx = bx + pad + (boxSize - lw) / 2;
    const ly = by + pad + (boxSize - lh) / 2;
    const scale = lw / logoNatW;

    const innerMatch = logoSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const logoInner = innerMatch ? innerMatch[1] : "";

    const overlay =
      `<rect x="${bx}" y="${by}" width="${totalBox}" height="${totalBox}" rx="${rx}" fill="${colors.light}"/>` +
      `<g transform="translate(${lx},${ly}) scale(${scale})">${logoInner}</g>`;

    return svgString.replace("</svg>", `${overlay}</svg>`);
  } catch {
    return svgString;
  }
}

// --- PNG 변환 (다운로드/복사용, SVG → Canvas → PNG) ---

async function svgToPngBlob(svgStr: string, size: number): Promise<Blob> {
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function QrPage() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<Format>("png");
  const [size, setSize] = useState(300);
  const [withLogo, setWithLogo] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const generatedText = useRef("");
  const svgCache = useRef("");

  const textTooLong = text.length > 2000;
  const canGenerate = text.trim().length > 0 && !textTooLong;

  const generate = useCallback(async (targetText: string, sz: number, logo: boolean, fg: string, bg: string) => {
    if (!targetText) return;
    setGenerating(true);
    try {
      const colors: QrColors = { dark: fg, light: bg };
      const svg = await buildSvgString(targetText, sz, logo, colors);
      svgCache.current = svg;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch {
      toast.error("QR 코드 생성에 실패했습니다.");
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleGenerate = () => {
    if (!canGenerate) return;
    generatedText.current = text.trim();
    generate(generatedText.current, size, withLogo, fgColor, bgColor);
  };

  useEffect(() => {
    if (generatedText.current) {
      generate(generatedText.current, size, withLogo, fgColor, bgColor);
    }
  }, [size, withLogo, fgColor, bgColor, generate]);

  const handleDownload = async () => {
    if (!svgCache.current) return;
    const a = document.createElement("a");
    if (format === "svg") {
      const blob = new Blob([svgCache.current], { type: "image/svg+xml" });
      a.href = URL.createObjectURL(blob);
      a.download = "qr.svg";
    } else {
      const pngBlob = await svgToPngBlob(svgCache.current, size);
      a.href = URL.createObjectURL(pngBlob);
      a.download = "qr.png";
    }
    a.click();
  };

  const handleCopy = async () => {
    if (!svgCache.current) return;
    try {
      const pngBlob = await svgToPngBlob(svgCache.current, size);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>다운로드 포맷</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="min-w-0 w-(--anchor-width)">
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="col-span-2 sm:col-span-4">
            <div className="flex items-center gap-2">
              <Switch
                id="qr-logo"
                checked={withLogo}
                onCheckedChange={setWithLogo}
              />
              <Label htmlFor="qr-logo">BCSD 로고 삽입</Label>
            </div>
          </div>
        </div>

        {previewUrl && (
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
            <img
              src={previewUrl}
              alt="QR 코드"
              className="max-h-[300px] max-w-[300px]"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-1 h-4 w-4" />
                다운로드 ({format.toUpperCase()})
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
