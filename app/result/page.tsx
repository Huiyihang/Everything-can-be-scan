import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import { LatestResult } from "@/components/LatestResult";

export default function ResultPage() {
  return (
    <main className="app-shell min-h-dvh px-4 py-5">
      <section className="mx-auto flex min-h-[calc(100dvh-40px)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">
              AI 扫物日记
            </p>
            <h1 className="mt-1 text-[30px] font-black leading-none text-ink">
              扫描结果
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              aria-label="返回首页"
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-line bg-white/90 text-ink shadow-sm backdrop-blur"
              href="/"
            >
              <ArrowLeft aria-hidden="true" size={17} strokeWidth={2.4} />
            </Link>
            <Link
              aria-label="历史记录"
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-line bg-white/90 text-ink shadow-sm backdrop-blur"
              href="/history"
            >
              <Clock3 aria-hidden="true" size={17} strokeWidth={2.4} />
            </Link>
          </div>
        </header>

        <LatestResult />
      </section>
    </main>
  );
}
