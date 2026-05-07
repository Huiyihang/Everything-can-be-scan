import Link from "next/link";
import { Clock3 } from "lucide-react";
import { UploadCard } from "@/components/UploadCard";

export default function HomePage() {
  return (
    <main className="app-shell min-h-dvh px-4 py-5">
      <section className="mx-auto flex min-h-[calc(100dvh-40px)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">
              AI 扫物日记
            </p>
            <h1 className="mt-1 text-[34px] font-black leading-none text-ink">
              万物皆可扫
            </h1>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-white/90 px-3 py-2 text-sm font-bold text-ink shadow-sm backdrop-blur"
            href="/history"
          >
            <Clock3 aria-hidden="true" size={16} strokeWidth={2.4} />
            历史
          </Link>
        </header>

        <UploadCard />
      </section>
    </main>
  );
}
