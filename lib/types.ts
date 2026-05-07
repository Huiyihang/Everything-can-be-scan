export const MAX_DIARY_LENGTH = 100;
export const HISTORY_STORAGE_KEY = "scan-everything-history";
export const LATEST_RESULT_STORAGE_KEY = "scan-everything-latest-result";

export type ObjectCategory =
  | "drinkware"
  | "footwear"
  | "bag"
  | "book"
  | "electronics"
  | "lighting"
  | "kitchenware"
  | "home"
  | "clothing"
  | "beauty"
  | "toy"
  | "plant"
  | "pet"
  | "unknown";

export type ObjectCondition =
  | "new"
  | "used"
  | "worn"
  | "damaged"
  | "dirty"
  | "idle"
  | "unknown";

export type EmotionTag =
  | "开心"
  | "委屈"
  | "疲惫"
  | "怀旧"
  | "得意"
  | "孤独"
  | "期待"
  | "摆烂"
  | "治愈"
  | "神秘";

export type ServiceType =
  | "shopping"
  | "repair"
  | "cleaning"
  | "recycle"
  | "local-life"
  | "content"
  | "pet-care"
  | "plant-care"
  | "generic";

export type UploadSource = "album" | "camera" | "example";

export type ScanStatus = "idle" | "preview" | "scanning" | "success" | "error";

export interface ServiceRecommendation {
  id: string;
  type: ServiceType;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  reason: string;
  providerName: string;
  serviceItems: string[];
  actionHint: string;
  taobaoKeyword: string;
  externalUrl: string;
  products: ServiceProduct[];
}

export interface ServiceProduct {
  title: string;
  description: string;
  tag: string;
  keyword: string;
  href: string;
}

export interface ScanResult {
  id: string;
  objectName: string;
  category: ObjectCategory;
  condition: ObjectCondition;
  conditionText: string;
  diary: string;
  emotionTags: EmotionTag[];
  service: ServiceRecommendation;
  createdAt: string;
}

export interface HistoryRecord extends ScanResult {
  imageDataUrl: string;
  source: UploadSource;
}

export interface ScanRequestPayload {
  imageDataUrl: string;
  source: UploadSource;
}

export interface AiObjectInsight {
  objectName: string;
  category: ObjectCategory;
  condition: ObjectCondition;
  conditionText: string;
  diary: string;
  emotionTags: EmotionTag[];
}

export interface ScanSuccessResponse {
  ok: true;
  result: ScanResult;
}

export interface ScanErrorResponse {
  ok: false;
  error: {
    code:
      | "INVALID_IMAGE"
      | "IMAGE_TOO_LARGE"
      | "NETWORK_ERROR"
      | "AI_FAILED"
      | "BAD_AI_RESPONSE"
      | "UNKNOWN_ERROR";
    message: string;
  };
}

export type ScanApiResponse = ScanSuccessResponse | ScanErrorResponse;
