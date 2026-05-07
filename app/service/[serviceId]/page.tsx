import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { getAllServiceIds, getServiceById } from "@/lib/serviceMap";

interface ServicePageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export function generateStaticParams() {
  return getAllServiceIds();
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = await params;
  const service = getServiceById(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <main className="app-shell min-h-dvh px-4 py-5">
      <section className="mx-auto flex min-h-[calc(100dvh-40px)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">
              推荐服务
            </p>
            <h1 className="mt-1 text-[30px] font-black leading-none text-ink">
              服务详情
            </h1>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-white/90 px-3 py-2 text-sm font-bold text-ink shadow-sm backdrop-blur"
            href="/"
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.4} />
            返回
          </Link>
        </header>

        <div className="glass-panel mt-5 flex flex-1 flex-col rounded-lg border border-white/70 p-4 shadow-panel">
          <div className="scan-stage relative overflow-hidden rounded-lg border border-line p-4">
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                <BadgeCheck aria-hidden="true" size={14} strokeWidth={2.4} />
                {service.providerName}
              </span>
              <h2 className="mt-4 text-[28px] font-black leading-tight text-ink">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {service.description}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-white/76 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-lemon/40 text-ink">
                <Sparkles aria-hidden="true" size={19} strokeWidth={2.4} />
              </span>
              <div>
                <p className="text-sm font-black text-ink">为什么推荐</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {service.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-mint/50 bg-mint/10 px-4 py-3 text-sm leading-6 text-ink">
            {service.actionHint}
          </div>

          <div className="mt-4 rounded-lg border border-line bg-white/76 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-ink">为你准备了 3 个入口</p>
                <p className="mt-1 text-xs font-semibold text-muted">
                  点击后跳转淘宝搜索
                </p>
              </div>
              <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-bold text-coral">
                淘宝
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {service.products.map((product) => (
                <a
                  className="block rounded-lg border border-line bg-paper p-3 transition hover:border-mint"
                  href={product.href}
                  key={product.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="rounded-full bg-lemon/35 px-2.5 py-1 text-xs font-bold text-ink">
                        {product.tag}
                      </span>
                      <h3 className="mt-2 text-base font-black text-ink">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {product.description}
                      </p>
                    </div>
                    <ExternalLink
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-mint"
                      size={18}
                      strokeWidth={2.4}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <a
            className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white shadow-sm"
            href={service.externalUrl}
            rel="noreferrer"
            target="_blank"
          >
            {service.buttonText}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
          </a>

          <Link
            className="mt-3 flex min-h-12 items-center justify-center rounded-lg border border-line bg-white/70 px-4 py-3 text-sm font-bold text-ink"
            href="/"
          >
            再扫一个物品
          </Link>
        </div>
      </section>
    </main>
  );
}
