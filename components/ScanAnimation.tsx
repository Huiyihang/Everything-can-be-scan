import { Sparkles } from "lucide-react";

interface ScanAnimationProps {
  imageDataUrl: string;
  alt: string;
}

export function ScanAnimation({ imageDataUrl, alt }: ScanAnimationProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-md bg-ink">
      <img
        alt={alt}
        className="h-full w-full object-cover opacity-80"
        src={imageDataUrl}
      />

      <div aria-hidden="true" className="absolute inset-0 bg-ink/20" />
      <div aria-hidden="true" className="scan-grid absolute inset-0" />
      <div aria-hidden="true" className="scan-line absolute inset-x-0 top-0" />

      <div aria-hidden="true" className="absolute inset-3">
        <span className="absolute left-0 top-0 size-7 border-l-2 border-t-2 border-mint" />
        <span className="absolute right-0 top-0 size-7 border-r-2 border-t-2 border-mint" />
        <span className="absolute bottom-0 left-0 size-7 border-b-2 border-l-2 border-mint" />
        <span className="absolute bottom-0 right-0 size-7 border-b-2 border-r-2 border-mint" />
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/20 bg-ink/82 px-3 py-3 text-white shadow-sm backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-white">
            <Sparkles aria-hidden="true" size={16} strokeWidth={2.4} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">AI 正在听它说话...</p>
            <p className="mt-0.5 text-xs leading-5 text-white/70">
              识别轮廓、观察状态、整理日记
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
