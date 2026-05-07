import {
  ArrowRight,
  Brush,
  MapPin,
  PawPrint,
  Recycle,
  ShoppingBag,
  Sparkles,
  Sprout,
  Wrench
} from "lucide-react";
import type { ServiceRecommendation, ServiceType } from "@/lib/types";

interface ServiceCardProps {
  service: ServiceRecommendation;
}

const serviceIcons: Record<ServiceType, typeof ShoppingBag> = {
  shopping: ShoppingBag,
  repair: Wrench,
  cleaning: Brush,
  recycle: Recycle,
  "local-life": MapPin,
  content: Sparkles,
  "pet-care": PawPrint,
  "plant-care": Sprout,
  generic: Sparkles
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = serviceIcons[service.type];

  return (
    <a
      className="block rounded-lg border border-line bg-white/76 p-4 shadow-sm transition hover:border-mint"
      href={service.href}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-mint text-white shadow-sm">
          <Icon aria-hidden="true" size={19} strokeWidth={2.3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">{service.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {service.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-mint">
            {service.buttonText}
            <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </a>
  );
}
