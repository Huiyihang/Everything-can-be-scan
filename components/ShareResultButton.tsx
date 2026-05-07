"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { createShareImage, downloadBlob } from "@/lib/shareImage";
import type { ScanResult } from "@/lib/types";

interface ShareResultButtonProps {
  imageDataUrl: string;
  result: ScanResult;
}

export function ShareResultButton({
  imageDataUrl,
  result
}: ShareResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">(
    "idle"
  );

  async function handleShare() {
    setStatus("generating");

    try {
      const blob = await createShareImage({ imageDataUrl, result });
      const file = new File([blob], `${result.objectName}-万物皆可扫.png`, {
        type: "image/png"
      });

      if (
        navigator.canShare?.({ files: [file] }) &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title: "万物皆可扫",
          text: result.diary,
          files: [file]
        });
      } else {
        downloadBlob(blob, file.name);
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white/70 px-4 py-3 text-sm font-bold text-ink"
        disabled={status === "generating"}
        type="button"
        onClick={handleShare}
      >
        <Share2 aria-hidden="true" size={17} strokeWidth={2.4} />
        {status === "generating" ? "正在生成分享图" : "分享结果图"}
      </button>
      {status === "done" ? (
        <p className="mt-2 text-center text-xs font-semibold text-mint">
          分享图已生成
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-center text-xs font-semibold text-coral">
          分享图生成失败，请稍后重试
        </p>
      ) : null}
    </div>
  );
}
