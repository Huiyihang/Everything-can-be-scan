import { scanObjectSystemPrompt, scanObjectUserText } from "@/lib/prompt";
import type {
  AiObjectInsight,
  EmotionTag,
  ObjectCategory,
  ObjectCondition
} from "@/lib/types";

type DashScopeMessageContent =
  | string
  | Array<{ text?: string; type?: string }>
  | undefined;

interface DashScopeChatResponse {
  choices?: Array<{
    message?: {
      content?: DashScopeMessageContent;
    };
  }>;
  error?: {
    code?: string;
    message?: string;
  };
}

const DEFAULT_DASHSCOPE_TIMEOUT_MS = 30_000;

export class DashScopeModelError extends Error {
  code: "AI_FAILED" | "BAD_AI_RESPONSE";

  constructor(code: "AI_FAILED" | "BAD_AI_RESPONSE", message: string) {
    super(message);
    this.name = "DashScopeModelError";
    this.code = code;
  }
}

const allowedCategories = new Set<ObjectCategory>([
  "drinkware",
  "footwear",
  "bag",
  "book",
  "electronics",
  "lighting",
  "kitchenware",
  "home",
  "clothing",
  "beauty",
  "toy",
  "plant",
  "pet",
  "unknown"
]);

const allowedConditions = new Set<ObjectCondition>([
  "new",
  "used",
  "worn",
  "damaged",
  "dirty",
  "idle",
  "unknown"
]);

const allowedEmotionTags = new Set<EmotionTag>([
  "开心",
  "委屈",
  "疲惫",
  "怀旧",
  "得意",
  "孤独",
  "期待",
  "摆烂",
  "治愈",
  "神秘"
]);

function getDashScopeConfig() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const baseUrl =
    process.env.DASHSCOPE_BASE_URL ??
    "https://dashscope.aliyuncs.com/compatible-mode/v1";
  const model = process.env.DASHSCOPE_MODEL ?? "qwen3-vl-32b-thinking";
  const timeoutValue = Number(process.env.DASHSCOPE_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(timeoutValue) && timeoutValue >= 5_000
      ? timeoutValue
      : DEFAULT_DASHSCOPE_TIMEOUT_MS;

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
    timeoutMs
  };
}

function extractTextContent(content: DashScopeMessageContent) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text)
      .filter((text): text is string => Boolean(text))
      .join("\n");
  }

  return "";
}

function stripThinkingAndCodeFence(value: string) {
  return value
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractJsonText(value: string) {
  const cleanedValue = stripThinkingAndCodeFence(value);
  const startIndex = cleanedValue.indexOf("{");
  const endIndex = cleanedValue.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new DashScopeModelError("BAD_AI_RESPONSE", "模型返回格式异常，请重试");
  }

  return cleanedValue.slice(startIndex, endIndex + 1);
}

function normalizeInsight(value: unknown): AiObjectInsight {
  if (!value || typeof value !== "object") {
    throw new DashScopeModelError("BAD_AI_RESPONSE", "模型返回格式异常，请重试");
  }

  const insight = value as Partial<AiObjectInsight>;
  const category = allowedCategories.has(insight.category as ObjectCategory)
    ? (insight.category as ObjectCategory)
    : "unknown";
  const condition = allowedConditions.has(insight.condition as ObjectCondition)
    ? (insight.condition as ObjectCondition)
    : "unknown";
  const emotionTags = Array.isArray(insight.emotionTags)
    ? insight.emotionTags.filter((tag): tag is EmotionTag =>
        allowedEmotionTags.has(tag as EmotionTag)
      )
    : [];

  return {
    objectName:
      typeof insight.objectName === "string" && insight.objectName.trim()
        ? insight.objectName.trim().slice(0, 24)
        : "未识别物品",
    category,
    condition,
    conditionText:
      typeof insight.conditionText === "string" && insight.conditionText.trim()
        ? insight.conditionText.trim().slice(0, 40)
        : "暂时无法判断它的具体状态。",
    diary:
      typeof insight.diary === "string" && insight.diary.trim()
        ? Array.from(insight.diary.trim()).slice(0, 100).join("")
        : "我被镜头认真看了一眼，忽然觉得今天也有点特别。",
    emotionTags: emotionTags.length > 0 ? emotionTags.slice(0, 3) : ["神秘"]
  };
}

export async function scanObjectWithDashScope(
  imageDataUrl: string
): Promise<AiObjectInsight> {
  const { apiKey, baseUrl, model, timeoutMs } = getDashScopeConfig();

  if (!apiKey) {
    throw new DashScopeModelError("AI_FAILED", "未配置 DASHSCOPE_API_KEY");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: scanObjectSystemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl
                }
              },
              {
                type: "text",
                text: scanObjectUserText
              }
            ]
          }
        ],
        temperature: 0.7
      })
    })
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? `模型响应超过 ${Math.round(timeoutMs / 1000)} 秒，请稍后重试`
        : "模型网络连接失败，请稍后重试";

    throw new DashScopeModelError("AI_FAILED", message);
  } finally {
    clearTimeout(timeoutId);
  }

  let data: DashScopeChatResponse;

  try {
    data = (await response.json()) as DashScopeChatResponse;
  } catch {
    throw new DashScopeModelError("BAD_AI_RESPONSE", "模型返回格式异常，请重试");
  }

  if (!response.ok) {
    const rawMessage = data.error?.message ?? "百炼模型调用失败";
    const friendlyMessage =
      /height|width|image|图片|InvalidParameter/i.test(rawMessage)
        ? "图片尺寸或格式不符合模型要求，请换一张清晰照片"
        : rawMessage;

    throw new DashScopeModelError(
      "AI_FAILED",
      friendlyMessage
    );
  }

  const content = extractTextContent(data.choices?.[0]?.message?.content);
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(extractJsonText(content));
  } catch (error) {
    if (error instanceof DashScopeModelError) {
      throw error;
    }

    throw new DashScopeModelError("BAD_AI_RESPONSE", "模型返回格式异常，请重试");
  }

  return normalizeInsight(parsedValue);
}
