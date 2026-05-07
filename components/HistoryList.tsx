"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Images, ScanSearch, Sparkles, Trash2 } from "lucide-react";
import { clearHistoryRecords, readHistoryRecords } from "@/lib/storage";
import type { HistoryRecord, UploadSource } from "@/lib/types";

function getSourceLabel(source: UploadSource) {
  if (source === "camera") {
    return "拍照";
  }

  if (source === "example") {
    return "示例";
  }

  return "相册";
}

function formatScanTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function getDiaryPreview(diary: string) {
  const chars = Array.from(diary.trim());

  if (chars.length <= 34) {
    return diary;
  }

  return `${chars.slice(0, 33).join("")}…`;
}

export function HistoryList() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setRecords(readHistoryRecords());
    setHasLoaded(true);
  }, []);

  function handleClearHistory() {
    clearHistoryRecords();
    setRecords([]);
  }

  if (!hasLoaded) {
    return (
      <div className="glass-panel mt-5 flex flex-1 items-center justify-center rounded-lg border border-white/70 p-5 text-center shadow-panel">
        <p className="text-sm font-semibold text-muted">正在读取本地记录...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="glass-panel mt-5 flex flex-1 items-center justify-center rounded-lg border border-white/70 p-5 text-center shadow-panel">
        <div>
          <div className="scan-stage relative mx-auto grid size-28 place-items-center rounded-lg border border-line">
            <div className="grid size-16 place-items-center rounded-full bg-ink text-white shadow-panel">
              <ScanSearch aria-hidden="true" size={30} strokeWidth={2.3} />
            </div>
          </div>
          <p className="mt-5 text-lg font-black text-ink">
            还没有扫描记录
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            扫过的物品会留在这里，方便回看它们的小日记。
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint">
            <Sparkles aria-hidden="true" size={14} strokeWidth={2.3} />
            下一次扫描会自动保存
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-muted">
          <Images aria-hidden="true" size={16} strokeWidth={2.3} />
          最近 {records.length} 条
        </p>
        <button
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-white/70 px-3 py-2 text-xs font-bold text-ink"
          type="button"
          onClick={handleClearHistory}
        >
          <Trash2 aria-hidden="true" size={15} strokeWidth={2.3} />
          清空
        </button>
      </div>

      <div className="space-y-3">
        {records.map((record) => (
          <Link
            aria-label={`查看 ${record.objectName} 的完整记录`}
            className="rounded-lg border border-line bg-white/72 p-3 shadow-sm"
            href={`/history/${encodeURIComponent(record.id)}`}
            key={record.id}
          >
            <div className="flex gap-3">
              <img
                alt={record.objectName}
                className="size-20 shrink-0 rounded-lg bg-paper object-cover shadow-sm"
                src={record.imageDataUrl}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-ink">
                      {record.objectName}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-mint">
                      {getSourceLabel(record.source)}识别
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
                    <Clock aria-hidden="true" size={13} strokeWidth={2.3} />
                    {formatScanTime(record.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {getDiaryPreview(record.diary)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
