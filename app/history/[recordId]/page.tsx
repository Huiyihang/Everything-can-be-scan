import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HistoryDetail } from "@/components/HistoryDetail";

interface HistoryDetailPageProps {
  params: Promise<{
    recordId: string;
  }>;
}

export default async function HistoryDetailPage({
  params
}: HistoryDetailPageProps) {
  const { recordId } = await params;

  return (
    <main className="app-shell min-h-dvh px-4 py-5">
      <section className="mx-auto flex min-h-[calc(100dvh-40px)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">
              回看记录
            </p>
            <h1 className="mt-1 text-[30px] font-black leading-none text-ink">
              物品日记
            </h1>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-white/90 px-3 py-2 text-sm font-bold text-ink shadow-sm backdrop-blur"
            href="/history"
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.4} />
            返回
          </Link>
        </header>

        <HistoryDetail recordId={recordId} />
      </section>
    </main>
  );
}
