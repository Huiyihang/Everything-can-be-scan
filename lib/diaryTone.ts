import { MAX_DIARY_LENGTH, type EmotionTag, type ScanResult } from "@/lib/types";

export type DiaryTone = "cute" | "roast" | "healing";

export const diaryToneOptions: Array<{
  label: string;
  tone: DiaryTone;
}> = [
  { label: "可爱", tone: "cute" },
  { label: "吐槽", tone: "roast" },
  { label: "治愈", tone: "healing" }
];

const toneTags: Record<DiaryTone, EmotionTag[]> = {
  cute: ["开心", "期待", "治愈"],
  roast: ["摆烂", "委屈", "神秘"],
  healing: ["治愈", "怀旧", "期待"]
};

function clipDiary(value: string) {
  return Array.from(value.trim()).slice(0, MAX_DIARY_LENGTH).join("");
}

function getConditionHint(result: ScanResult) {
  if (result.condition === "damaged") {
    return "身上有点小伤";
  }

  if (result.condition === "dirty") {
    return "脸上沾了点灰";
  }

  if (result.condition === "worn") {
    return "边角写满了使用痕迹";
  }

  if (result.condition === "idle") {
    return "在角落等了好久";
  }

  if (result.condition === "new") {
    return "今天状态亮晶晶";
  }

  return "今天也在认真陪伴";
}

function createDiary(result: ScanResult, tone: DiaryTone) {
  const name = result.objectName;
  const hint = getConditionHint(result);

  if (tone === "cute") {
    return `我是${name}，${hint}，但还是乖乖举手营业。请摸摸我的小脑袋，再带我去看看新任务吧。`;
  }

  if (tone === "roast") {
    return `我是${name}，${hint}。每天被看见才想起我，哼，也行吧，至少这次终于有人关心我的去处了。`;
  }

  return `我是${name}，${hint}。被镜头轻轻看见的这一刻，我觉得自己还可以继续发光一小会儿。`;
}

export function rewriteScanResultDiary(
  result: ScanResult,
  tone: DiaryTone
): ScanResult {
  return {
    ...result,
    diary: clipDiary(createDiary(result, tone)),
    emotionTags: toneTags[tone]
  };
}
