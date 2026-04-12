import { cn } from "@/shared/lib/cn";
import styles from "./digest-grid.module.css";
import { DigestCard } from "./digest-card";
import type { DigestGridLayoutItem } from "./home-digest.config";
import type { HomeDigestCard, HomeDigestCardId } from "./home-digest.data";

type DigestGridProps = {
  cardsById: Record<HomeDigestCardId, HomeDigestCard>;
  layoutItems: DigestGridLayoutItem[];
  className?: string;
};

export function DigestGrid({
  cardsById,
  layoutItems,
  className,
}: DigestGridProps) {
  return (
    <div className={cn("grid gap-[30px]", styles.responsiveGrid, className)}>
      {layoutItems.map(({ area, cardId }) => {
        const card = cardsById[cardId];

        if (!card) {
          return null;
        }

        return (
          <div key={card.id} className="h-full" style={{ gridArea: area }}>
            <DigestCard item={card} layout="grid" />
          </div>
        );
      })}
    </div>
  );
}
