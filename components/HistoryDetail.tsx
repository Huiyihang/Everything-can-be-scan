"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, ScanSearch } from "lucide-react";
import { ResultBubble } from "@/components/ResultBubble";
import { ServiceCard } from "@/components/ServiceCard";
import { ShareResultButton } from "@/components/ShareResultButton";
import { readHistoryRecordById } from "@/lib/storage";
import type { HistoryRecord, UploadSource } from "@/lib/types";

interface HistoryDetailProps {
  recordId: string;
}

function getSourceLabel(source: UploadSource) {
  if (source === "camera") {
    return "拍照识别";
  }

  if (source === "example") {
    return "示例识别";
  }

  return "相册识别";
}

function formatScanTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function HistoryDetail({ recordId }: HistoryDetailProps) {
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setRecord(readHistoryRecordById(recordId));
    setHasLoaded(true);
  }, [recordId]);

  if (!hasLoaded) {
    return (
      <div className="glass-panel mt-5 flex flex-1 items-center justify-center rounded-lg border border-white/70 p-5 text-center shadow-panel">
        <p className="text-sm font-semibold text-muted">正在读取这条小日记...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="glass-panel mt-5 flex flex-1 items-center justify-center rounded-lg border border-white/70 p-5 text-center shadow-panel">
        <div>
          <div className="scan-stage relative mx-auto grid size-28 place-items-center rounded-lg border border-line">
            <div className="grid size-16 place-items-center rounded-full bg-ink text-white shadow-panel">
              <ScanSearch aria-hidden="true" size={30} strokeWidth={2.3} />
            </div>
          </div>
          <p className="mt-5 text-lg font-black text-ink">记录不见了</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            这条记录可能已经被清空，或者来自其他浏览器。
          </p>
          <Link
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white"
            href="/history"
          >
            返回历史
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink shadow-sm">
        <img
          alt={record.objectName}
          className="h-full w-full object-cover"
          src={record.imageDataUrl}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10" />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
          {getSourceLabel(record.source)}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-mint">历史记录</p>
        <h2 className="mt-1 text-[28px] font-black leading-tight text-ink">
          {record.objectName}
        </h2>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
          <Clock3 aria-hidden="true" size={14} strokeWidth={2.4} />
          {formatScanTime(record.createdAt)}
        </p>
      </div>

      <p className="mt-3 rounded-lg border border-line bg-white/72 px-3 py-3 text-sm leading-6 text-muted">
        {record.conditionText}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {record.emotionTags.map((tag) => (
          <span
            className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral"
            key={tag}
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <ResultBubble diary={record.diary} />
      </div>

      <div className="mt-4">
        <ServiceCard service={record.service} />
      </div>

      <div className="mt-4">
        <ShareResultButton imageDataUrl={record.imageDataUrl} result={record} />
      </div>

      <Link
        className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white/70 px-4 py-3 text-sm font-bold text-ink"
        href="/history"
      >
        <ArrowLeft aria-hidden="true" size={17} strokeWidth={2.4} />
        返回历史
      </Link>
    </div>
  );
}
