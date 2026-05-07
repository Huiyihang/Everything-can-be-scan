import { Activity, BadgeCheck, RotateCcw, Tag } from "lucide-react";
import { ResultBubble } from "@/components/ResultBubble";
import { ServiceCard } from "@/components/ServiceCard";
import { ShareResultButton } from "@/components/ShareResultButton";
import type {
  ObjectCategory,
  ObjectCondition,
  ScanResult,
  UploadSource
} from "@/lib/types";

interface ScanResultPanelProps {
  imageDataUrl: string;
  result: ScanResult;
  source: UploadSource;
  onReset: () => void;
}

const categoryLabels: Record<ObjectCategory, string> = {
  drinkware: "杯具",
  footwear: "鞋履",
  bag: "包袋",
  book: "书本",
  electronics: "数码",
  lighting: "灯具",
  kitchenware: "厨具",
  home: "家居",
  clothing: "衣物",
  beauty: "美妆",
  toy: "玩具",
  plant: "植物",
  pet: "宠物",
  unknown: "未知"
};

const conditionLabels: Record<ObjectCondition, string> = {
  new: "状态新",
  used: "使用中",
  worn: "有磨损",
  damaged: "有损伤",
  dirty: "待清洁",
  idle: "闲置中",
  unknown: "待判断"
};

export function ScanResultPanel({
  imageDataUrl,
  result,
  source,
  onReset
}: ScanResultPanelProps) {
  const sourceLabel =
    source === "camera" ? "拍照识别" : source === "example" ? "示例识别" : "相册识别";
  const categoryLabel = categoryLabels[result.category];
  const conditionLabel = conditionLabels[result.condition];

  return (
    <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink shadow-sm">
        <img
          alt={result.objectName}
          className="h-full w-full object-cover"
          src={imageDataUrl}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
          <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            {sourceLabel}
          </span>
          {source === "example" ? (
            <span className="rounded-md bg-mint px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              示例
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-mint px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <BadgeCheck aria-hidden="true" size={13} strokeWidth={2.4} />
              已识别
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-mint">识别结果</p>
          <h2 className="mt-1 text-[28px] font-black leading-tight text-ink">
            {result.objectName}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lemon/35 px-3 py-1.5 text-xs font-bold text-ink">
          <Tag aria-hidden="true" size={14} strokeWidth={2.4} />
          {categoryLabel}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-line bg-white/72 px-3 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Activity aria-hidden="true" size={14} strokeWidth={2.4} />
          {conditionLabel}
        </div>
        <p className="text-sm leading-6 text-muted">{result.conditionText}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {result.emotionTags.map((tag) => (
          <span
            className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral"
            key={tag}
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <ResultBubble diary={result.diary} />
      </div>

      <div className="mt-4">
        <ServiceCard service={result.service} />
      </div>

      <div className="mt-4">
        <ShareResultButton imageDataUrl={imageDataUrl} result={result} />
      </div>

      <button
        className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white shadow-sm"
        type="button"
        onClick={onReset}
      >
        <RotateCcw aria-hidden="true" size={18} strokeWidth={2.3} />
        再扫一个
      </button>
    </div>
  );
}
