"use client";

import type { HomeDigestData } from "@/shared/lib/payload/home-page";
import { MobileSnapCarousel } from "../../shared/ui/mobile-snap-carousel";
import { PageSubheading } from "../../shared/ui/page-subheading";
import { DigestCard } from "./digest-card";
import { DigestGrid } from "./digest-grid";
import { DIGEST_GRID_LAYOUT, DIGEST_MOBILE_ORDER } from "./home-digest.config";
import type { HomeDigestCard, HomeDigestCardId } from "./home-digest.data";

export function HomeDigest({ data }: { data: HomeDigestData }) {
  const digestCardsById = data.cards.reduce<Record<HomeDigestCardId, HomeDigestCard>>((acc, card) => {
    acc[card.id] = card;
    return acc;
  }, {} as Record<HomeDigestCardId, HomeDigestCard>);
  const mobileDigestCards = DIGEST_MOBILE_ORDER.map((cardId) => digestCardsById[cardId]).filter((card): card is HomeDigestCard => Boolean(card));

  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={data.title} description={data.description} descriptionPlacement="side" sideDescriptionLayout="two-columns" />

      <MobileSnapCarousel
        items={mobileDigestCards}
        className="mt-[36px] md:hidden"
        getItemKey={(card) => card.id}
        renderItem={(card) => <DigestCard item={card} layout="mobile" />}
        slideWidth="100vw"
        slideInset="var(--layout-side-padding)"
        gap="0px"
        opts={{
          align: "center",
          loop: false,
          dragFree: false,
          skipSnaps: false,
          containScroll: false,
          slidesToScroll: 1,
        }}
        prevAriaLabel="Предыдущая карточка"
        nextAriaLabel="Следующая карточка"
      />

      <DigestGrid cardsById={digestCardsById} layoutItems={DIGEST_GRID_LAYOUT.items} className="hidden md:grid mt-[55px]" />
    </section>
  );
}
