import { NextRequest, NextResponse } from "next/server";
import { DashScopeModelError, scanObjectWithDashScope } from "@/lib/dashscope";
import { createMockScanResult } from "@/lib/mockData";
import { getServiceRecommendation } from "@/lib/serviceMap";
import type {
  AiObjectInsight,
  ScanApiResponse,
  ScanErrorResponse,
  ScanRequestPayload,
  ScanResult,
  UploadSource
} from "@/lib/types";

const MAX_IMAGE_DATA_URL_LENGTH = 12_000_000;

export const dynamic = "force-dynamic";

function createScanResult(insight: AiObjectInsight): ScanResult {
  return {
    id: `scan-${Date.now()}`,
    ...insight,
    service: getServiceRecommendation(insight.category, insight.condition),
    createdAt: new Date().toISOString()
  };
}

function createErrorResponse(
  status: number,
  code: ScanErrorResponse["error"]["code"],
  message: string
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message
      }
    } satisfies ScanApiResponse,
    { status }
  );
}

function isUploadSource(value: unknown): value is UploadSource {
  return value === "album" || value === "camera" || value === "example";
}

function isImageDataUrl(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/[a-zA-Z0-9.+-]+(;base64)?,/.test(value);
}

function parsePayload(value: unknown): ScanRequestPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Partial<ScanRequestPayload>;

  if (!isImageDataUrl(payload.imageDataUrl) || !isUploadSource(payload.source)) {
    return null;
  }

  return {
    imageDataUrl: payload.imageDataUrl,
    source: payload.source
  };
}

export async function POST(request: NextRequest) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return createErrorResponse(400, "INVALID_IMAGE", "请求体不是有效 JSON");
  }

  const payload = parsePayload(rawPayload);

  if (!payload) {
    return createErrorResponse(400, "INVALID_IMAGE", "请上传有效的图片数据");
  }

  if (payload.imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return createErrorResponse(413, "IMAGE_TOO_LARGE", "图片过大，请换一张更小的照片");
  }

  if (process.env.SCAN_USE_MOCK === "true" || payload.source === "example") {
    const result = createMockScanResult();

    return NextResponse.json({
      ok: true,
      result
    } satisfies ScanApiResponse);
  }

  let result: ScanResult;

  try {
    const insight = await scanObjectWithDashScope(payload.imageDataUrl);
    result = createScanResult(insight);
  } catch (error) {
    if (error instanceof DashScopeModelError) {
      return createErrorResponse(502, error.code, error.message);
    }

    const message =
      error instanceof Error ? error.message : "视觉模型调用失败，请稍后重试";

    return createErrorResponse(502, "AI_FAILED", message);
  }

  return NextResponse.json({
    ok: true,
    result
  } satisfies ScanApiResponse);
}
