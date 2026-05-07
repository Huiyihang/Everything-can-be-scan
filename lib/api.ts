import type {
  ScanErrorResponse,
  ScanApiResponse,
  ScanRequestPayload,
  ScanResult
} from "@/lib/types";

const SCAN_REQUEST_TIMEOUT_MS = 45_000;

export class ScanObjectError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ScanObjectError";
    this.code = code;
  }
}

export async function scanObject(
  payload: ScanRequestPayload
): Promise<ScanResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    SCAN_REQUEST_TIMEOUT_MS
  );
  let response: Response;

  try {
    response = await fetch("/api/scan-object", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify(payload)
    });
  } catch (error) {
    const isTimeout =
      error instanceof DOMException && error.name === "AbortError";

    throw new ScanObjectError(
      isTimeout ? "NETWORK_TIMEOUT" : "NETWORK_ERROR",
      isTimeout ? "扫描响应超时，请稍后重试" : "网络连接失败，请检查后重试"
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  let data: ScanApiResponse;

  try {
    data = (await response.json()) as ScanApiResponse;
  } catch {
    throw new ScanObjectError("BAD_API_RESPONSE", "扫描接口返回异常");
  }

  if (!response.ok || !data.ok) {
    const error: ScanErrorResponse["error"] = data.ok
      ? { code: "UNKNOWN_ERROR", message: "扫描失败，请稍后重试" }
      : data.error;

    throw new ScanObjectError(error.code, error.message);
  }

  return data.result;
}
