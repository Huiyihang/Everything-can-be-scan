"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Radar,
  RotateCcw,
  ScanLine,
  Sparkles,
  WandSparkles,
  X
} from "lucide-react";
import { ScanAnimation } from "@/components/ScanAnimation";
import { scanObject, ScanObjectError } from "@/lib/api";
import { compressImageFile, formatImageSize } from "@/lib/imageTools";
import { MOCK_EXAMPLE_IMAGE_DATA_URL } from "@/lib/mockData";
import { saveHistoryRecord, saveLatestResult } from "@/lib/storage";
import type { ScanStatus, UploadSource } from "@/lib/types";

const SCAN_ANIMATION_DURATION_MS = 3200;
const MAX_UPLOAD_FILE_SIZE = 16 * 1024 * 1024;
const MAX_COMPRESSED_DATA_URL_LENGTH = 10_000_000;

interface SelectedImage {
  dataUrl: string;
  name: string;
  source: UploadSource;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function UploadCardLoading() {
  return (
    <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
      <div>
        <p className="text-base font-bold text-ink">
          拍下身边任何物品，听听它今天想说什么
        </p>
        <div className="scan-stage relative mt-5 aspect-[4/5] overflow-hidden rounded-lg border border-dashed border-line p-3">
          <div className="relative flex h-full flex-col items-center justify-center rounded-md border border-line bg-white/86 px-6 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-mint/10 text-mint">
              <ScanLine aria-hidden="true" size={28} strokeWidth={2.2} />
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">
              正在准备扫描入口
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UploadCard() {
  const router = useRouter();
  const albumInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (scanStatus !== "scanning") {
      return;
    }

    if (!selectedImage) {
      setScanStatus("error");
      setNotice("扫描中断，请重新选择图片");
      return;
    }

    let isActive = true;

    async function runScan() {
      if (!selectedImage) {
        return;
      }

      try {
        const [result] = await Promise.all([
          scanObject({
            imageDataUrl: selectedImage.dataUrl,
            source: selectedImage.source
          }),
          wait(SCAN_ANIMATION_DURATION_MS)
        ]);

        if (!isActive) {
          return;
        }

        const record = {
          ...result,
          imageDataUrl: selectedImage.dataUrl,
          source: selectedImage.source
        };

        saveHistoryRecord(record);
        saveLatestResult(record);
        router.push("/result");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setScanStatus("error");
        setNotice(
          error instanceof ScanObjectError
            ? error.message
            : "扫描失败，请稍后重试"
        );
      }
    }

    runScan();

    return () => {
      isActive = false;
    };
  }, [router, scanStatus, selectedImage]);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    source: UploadSource
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setNotice("请选择图片文件");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      setNotice(
        `图片太大了，当前 ${formatImageSize(file.size)}，请换一张 16MB 以内的照片`
      );
      event.target.value = "";
      return;
    }

    setNotice("正在优化图片...");

    try {
      const compressedImage = await compressImageFile(file);

      if (compressedImage.dataUrl.length > MAX_COMPRESSED_DATA_URL_LENGTH) {
        setNotice("图片压缩后仍然偏大，请换一张更清晰但更小的照片");
        event.target.value = "";
        return;
      }

      setSelectedImage({
        dataUrl: compressedImage.dataUrl,
        name: file.name || "随手拍",
        source
      });
      setScanStatus("preview");
      setNotice(
        compressedImage.wasCompressed
          ? `已优化图片：${formatImageSize(compressedImage.originalSize)} → ${formatImageSize(compressedImage.compressedSize)}`
          : ""
      );
    } catch {
      setNotice("图片读取失败，请重新选择");
    } finally {
      event.target.value = "";
    }
  }

  function clearSelectedImage() {
    setSelectedImage(null);
    setScanStatus("idle");
    setNotice("");
  }

  function handleStartScan() {
    if (!selectedImage) {
      setNotice("请先上传或拍摄一张物品照片");
      return;
    }

    setScanStatus("scanning");
    setNotice("");
  }

  function handleUseExample() {
    setSelectedImage({
      dataUrl: MOCK_EXAMPLE_IMAGE_DATA_URL,
      name: "缺口杯子示例",
      source: "example"
    });
    setScanStatus("preview");
    setNotice("");
  }

  function handleRetryScan() {
    if (!selectedImage) {
      setNotice("请先上传或拍摄一张物品照片");
      return;
    }

    setScanStatus("scanning");
    setNotice("");
  }

  const isScanning = scanStatus === "scanning";
  const hasError = scanStatus === "error";
  const selectedSourceLabel =
    selectedImage?.source === "camera"
      ? "拍照"
      : selectedImage?.source === "example"
        ? "示例"
        : "相册";

  if (!hasMounted) {
    return <UploadCardLoading />;
  }

  return (
    <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
      <input
        ref={albumInputRef}
        accept="image/*"
        className="sr-only"
        type="file"
        onChange={(event) => handleFileChange(event, "album")}
      />
      <input
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="sr-only"
        type="file"
        onChange={(event) => handleFileChange(event, "camera")}
      />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-ink">
              拍下身边任何物品
            </p>
          <p className="mt-1 text-sm leading-6 text-muted">
              让它用第一人称讲讲今天的心情
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lemon/30 px-2.5 py-1 text-xs font-bold text-ink">
            <WandSparkles aria-hidden="true" size={13} strokeWidth={2.4} />
            视觉 AI
          </span>
        </div>

        <div className="scan-stage relative mt-4 aspect-[4/5] overflow-hidden rounded-lg border border-dashed border-line p-3">
          {selectedImage && isScanning ? (
            <ScanAnimation
              alt={selectedImage.name}
              imageDataUrl={selectedImage.dataUrl}
            />
          ) : selectedImage ? (
            <div className="relative h-full overflow-hidden rounded-md bg-ink">
              <img
                alt={selectedImage.name}
                className="h-full w-full object-cover"
                src={selectedImage.dataUrl}
              />
              <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
                <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
                  {selectedSourceLabel}
                </span>
                <button
                  aria-label="清除图片"
                  className="grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm"
                  disabled={isScanning}
                  type="button"
                  onClick={clearSelectedImage}
                >
                  <X aria-hidden="true" size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-md border border-line bg-white/86 px-6 text-center">
              <div
                aria-hidden="true"
                className="absolute inset-x-8 top-8 h-1 rounded-full bg-mint/30"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-8 left-8 h-1 w-16 rounded-full bg-coral/25"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-8 right-8 h-1 w-16 rounded-full bg-lemon/50"
              />
              <div className="grid size-16 place-items-center rounded-full bg-ink text-white shadow-panel">
                <Radar aria-hidden="true" size={30} strokeWidth={2.2} />
              </div>
              <p className="mt-4 text-base font-bold text-ink">
                选择一张物品照片
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                杯子、鞋子、台灯、键盘都可以
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ink px-3 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isScanning}
          type="button"
          onClick={() => albumInputRef.current?.click()}
        >
          <ImagePlus aria-hidden="true" size={18} strokeWidth={2.3} />
          上传图片
        </button>
        <button
          className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-mint px-3 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isScanning}
          type="button"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera aria-hidden="true" size={18} strokeWidth={2.3} />
          拍照扫描
        </button>
      </div>

      <button
        className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-lg bg-coral px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-wait disabled:bg-line disabled:text-muted"
        disabled={!selectedImage || isScanning}
        type="button"
        onClick={hasError ? handleRetryScan : handleStartScan}
      >
        {isScanning ? (
          <span className="size-4 rounded-full border-2 border-muted/40 border-t-muted motion-safe:animate-spin" />
        ) : hasError ? (
          <RotateCcw aria-hidden="true" size={18} strokeWidth={2.3} />
        ) : selectedImage ? (
          <ScanLine aria-hidden="true" size={18} strokeWidth={2.3} />
        ) : (
          <RotateCcw aria-hidden="true" size={18} strokeWidth={2.3} />
        )}
        {isScanning ? "扫描中" : hasError ? "重新扫描" : "开始扫描"}
      </button>

      {hasError && selectedImage ? (
        <div className="mt-3 rounded-lg border border-coral/20 bg-coral/10 px-3 py-3 text-sm leading-6 text-coral">
          <p>{notice || "识别失败，请重新扫描"}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="min-h-10 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink"
              type="button"
              onClick={clearSelectedImage}
            >
              换张照片
            </button>
            <button
              className="min-h-10 rounded-lg bg-coral px-3 py-2 text-xs font-semibold text-white"
              type="button"
              onClick={handleUseExample}
            >
              看示例结果
            </button>
          </div>
        </div>
      ) : null}

      {!selectedImage ? (
        <button
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white/70 px-4 py-2.5 text-sm font-bold text-ink"
          type="button"
          onClick={handleUseExample}
        >
          <Sparkles aria-hidden="true" size={17} strokeWidth={2.3} />
          试试示例体验
        </button>
      ) : null}

      <p className="min-h-6 pt-2 text-center text-xs font-medium text-muted">
        {hasError ? "" : notice}
      </p>
    </div>
  );
}
