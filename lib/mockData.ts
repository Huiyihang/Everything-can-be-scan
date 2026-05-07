import { getServiceRecommendation } from "@/lib/serviceMap";
import type { ScanResult } from "@/lib/types";

const mockExampleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f8fb" />
      <stop offset="1" stop-color="#dfe8ee" />
    </linearGradient>
    <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" />
      <stop offset="1" stop-color="#d9dee8" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#171820" flood-opacity=".18" />
    </filter>
  </defs>
  <rect width="640" height="480" fill="url(#bg)" />
  <circle cx="508" cy="94" r="46" fill="#f2c94c" opacity=".72" />
  <path d="M150 365c70 28 260 31 340 4" fill="none" stroke="#c7d0dc" stroke-width="18" stroke-linecap="round" opacity=".65" />
  <g filter="url(#shadow)">
    <path d="M212 142h210l-22 224c-4 39-35 58-82 58h-2c-48 0-78-19-82-58L212 142z" fill="url(#cup)" />
    <path d="M421 190h35c40 0 68 29 61 66-7 38-42 61-82 58h-25l8-44h23c19 0 35-11 39-28 4-18-9-32-30-32h-31z" fill="none" stroke="#ffffff" stroke-width="28" stroke-linecap="round" />
    <ellipse cx="317" cy="143" rx="106" ry="32" fill="#ffffff" />
    <ellipse cx="317" cy="145" rx="78" ry="19" fill="#e8eef4" />
    <path d="M391 124l29 23-26 16-20-18z" fill="#f7f8fb" />
    <path d="M385 126l26 20" stroke="#aeb8c6" stroke-width="6" stroke-linecap="round" />
    <path d="M270 204c26 17 70 17 97 0" fill="none" stroke="#19b59f" stroke-width="8" stroke-linecap="round" opacity=".7" />
  </g>
  <text x="320" y="58" text-anchor="middle" font-family="Arial, Microsoft YaHei, sans-serif" font-size="24" font-weight="700" fill="#171820">缺口杯子示例</text>
</svg>`;

export const MOCK_EXAMPLE_IMAGE_DATA_URL = `data:image/svg+xml,${encodeURIComponent(
  mockExampleSvg
)}`;

export function createMockScanResult(): ScanResult {
  return {
    id: `mock-${Date.now()}`,
    objectName: "缺口的杯子",
    category: "drinkware",
    condition: "damaged",
    conditionText: "杯口有轻微缺口，仍能使用，但已经不太适合热饮。",
    diary:
      "今天又陪主人喝水啦。虽然我的杯口少了一小块，但我还是努力站稳。要是能退休去当花盆，也挺浪漫。",
    emotionTags: ["委屈", "怀旧", "治愈"],
    createdAt: new Date().toISOString(),
    service: getServiceRecommendation("drinkware", "damaged")
  };
}
