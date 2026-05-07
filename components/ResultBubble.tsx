import { MessageCircle } from "lucide-react";
import { MAX_DIARY_LENGTH } from "@/lib/types";

interface ResultBubbleProps {
  diary: string;
}

export function ResultBubble({ diary }: ResultBubbleProps) {
  const diaryChars = Array.from(diary.trim());
  const displayDiary =
    diaryChars.length > MAX_DIARY_LENGTH
      ? `${diaryChars.slice(0, MAX_DIARY_LENGTH - 1).join("")}…`
      : diary.trim();
  const displayLength = Array.from(displayDiary).length;

  return (
    <div className="relative rounded-lg bg-ink px-4 py-4 text-white shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-white/70">
        <span className="inline-flex items-center gap-2">
          <MessageCircle aria-hidden="true" size={15} strokeWidth={2.3} />
          它的小日记
        </span>
        <span>{displayLength}/{MAX_DIARY_LENGTH} 字</span>
      </div>
      <p className="text-[15px] font-medium leading-7">{displayDiary}</p>
      <span
        aria-hidden="true"
        className="absolute -top-2 left-7 size-4 rotate-45 bg-ink"
      />
    </div>
  );
}
