import { ContentCard } from "@/shared/ui/content-card";
import type { PartnerProductItem } from "./types";

export function PartnerProductCard({ item }: { item: PartnerProductItem }) {
  return (
    <ContentCard
      title={item.title}
      excerpt={item.description}
      href={item.href}
      ctaLabel="Узнать подробнее"
      image={{ url: item.imageUrl, alt: item.title, width: 413, height: 400 }}
      imageContainerClassName="aspect-square"
    />
  );
}
