"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, ScanSearch } from "lucide-react";
import { ScanResultPanel } from "@/components/ScanResultPanel";
import {
  clearLatestResult,
  readLatestResult
} from "@/lib/storage";
import type { HistoryRecord } from "@/lib/types";

export function LatestResult() {
  const router = useRouter();
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setRecord(readLatestResult());
    setHasLoaded(true);
  }, []);

  function handleReset() {
    clearLatestResult();
    router.push("/");
  }

  if (!hasLoaded) {
    return (
      <div className="glass-panel mt-5 flex flex-1 items-center justify-center rounded-lg border border-white/70 p-5 text-center shadow-panel">
        <p className="text-sm font-semibold text-muted">正在唤醒刚才的扫描结果...</p>
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
          <p className="mt-5 text-lg font-black text-ink">还没有当前结果</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            刷新后仍会保留最近一次扫描；如果已经换了标签页，可以去历史记录找回。
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white"
              href="/"
            >
              去扫描
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-line bg-white/75 px-4 py-3 text-sm font-bold text-ink"
              href="/history"
            >
              <Clock3 aria-hidden="true" size={16} strokeWidth={2.4} />
              历史
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScanResultPanel
        imageDataUrl={record.imageDataUrl}
        result={record}
        source={record.source}
        onReset={handleReset}
      />
      <Link
        className="mt-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-line bg-white/80 px-4 py-3 text-sm font-bold text-ink shadow-sm"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.4} />
        回到首页
      </Link>
    </>
  );
}
