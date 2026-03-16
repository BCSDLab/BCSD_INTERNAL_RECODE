import { apiClient } from "./client";
import type { QrParams } from "@/types/qr";

export async function generateQr(params: QrParams): Promise<Blob> {
  const { data } = await apiClient.get<Blob>("/v1/qr", {
    params,
    responseType: "blob",
  });
  return data;
}
