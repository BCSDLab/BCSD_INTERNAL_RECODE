import { useQuery } from "@tanstack/react-query";
import { generateQr } from "@/api/qr";
import type { QrParams } from "@/types/qr";

export function useQrPreview(params: QrParams | null) {
  return useQuery({
    queryKey: ["qr", params],
    queryFn: () => generateQr(params!),
    enabled: !!params?.text,
    staleTime: Infinity,
  });
}
