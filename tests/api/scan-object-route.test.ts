import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/scan-object/route";
import { DashScopeModelError, scanObjectWithDashScope } from "@/lib/dashscope";
import type { AiObjectInsight, ScanApiResponse } from "@/lib/types";

vi.mock("@/lib/dashscope", async () => {
  const actual = await vi.importActual<typeof import("@/lib/dashscope")>(
    "@/lib/dashscope"
  );

  return {
    ...actual,
    scanObjectWithDashScope: vi.fn()
  };
});

const validImageDataUrl = "data:image/png;base64,aGVsbG8=";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/scan-object", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

async function readResponse(response: Response) {
  return (await response.json()) as ScanApiResponse;
}

describe("POST /api/scan-object", () => {
  beforeEach(() => {
    vi.mocked(scanObjectWithDashScope).mockReset();
    delete process.env.SCAN_USE_MOCK;
  });

  it("rejects invalid image payloads", async () => {
    const response = await POST(createRequest({ imageDataUrl: "bad", source: "album" }));
    const data = await readResponse(response);

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    if (!data.ok) {
      expect(data.error.code).toBe("INVALID_IMAGE");
    }
  });

  it("returns mock results for example scans without calling the model", async () => {
    const response = await POST(
      createRequest({ imageDataUrl: validImageDataUrl, source: "example" })
    );
    const data = await readResponse(response);

    expect(response.status).toBe(200);
    expect(scanObjectWithDashScope).not.toHaveBeenCalled();
    expect(data.ok).toBe(true);
    if (data.ok) {
      expect(data.result.service.products).toHaveLength(3);
      expect(data.result.id).toMatch(/^mock-/);
    }
  });

  it("builds a structured scan result from model insight", async () => {
    const insight: AiObjectInsight = {
      objectName: "台灯",
      category: "lighting",
      condition: "used",
      conditionText: "灯罩有轻微使用痕迹",
      diary: "我今天也在努力发光。",
      emotionTags: ["治愈"]
    };

    vi.mocked(scanObjectWithDashScope).mockResolvedValue(insight);

    const response = await POST(
      createRequest({ imageDataUrl: validImageDataUrl, source: "album" })
    );
    const data = await readResponse(response);

    expect(response.status).toBe(200);
    expect(scanObjectWithDashScope).toHaveBeenCalledWith(validImageDataUrl);
    expect(data.ok).toBe(true);
    if (data.ok) {
      expect(data.result.objectName).toBe("台灯");
      expect(data.result.service.id).toBe("lighting-local-life");
      expect(data.result.createdAt).toEqual(expect.any(String));
    }
  });

  it("maps model failures to API error responses", async () => {
    vi.mocked(scanObjectWithDashScope).mockRejectedValue(
      new DashScopeModelError("BAD_AI_RESPONSE", "模型返回格式异常，请重试")
    );

    const response = await POST(
      createRequest({ imageDataUrl: validImageDataUrl, source: "camera" })
    );
    const data = await readResponse(response);

    expect(response.status).toBe(502);
    expect(data.ok).toBe(false);
    if (!data.ok) {
      expect(data.error.code).toBe("BAD_AI_RESPONSE");
    }
  });
});
