import { PageSubheading } from "../../shared/ui/page-subheading";
import { DigestGrid } from "./digest-grid";
import { DigestMobileCarousel } from "./digest-mobile-carousel";
import { DIGEST_GRID_LAYOUT, DIGEST_MOBILE_ORDER } from "./home-digest.config";
import {
	DIGEST_CARDS,
	DIGEST_DESCRIPTION,
	DIGEST_TITLE,
	type HomeDigestCard,
	type HomeDigestCardId,
} from "./home-digest.data";

const DIGEST_CARDS_BY_ID = DIGEST_CARDS.reduce<Record<HomeDigestCardId, HomeDigestCard>>((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {} as Record<HomeDigestCardId, HomeDigestCard>);

const MOBILE_DIGEST_CARDS = DIGEST_MOBILE_ORDER.map((cardId) => DIGEST_CARDS_BY_ID[cardId]).filter(
  (card): card is HomeDigestCard => Boolean(card),
);

export function HomeDigest() {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px]">
      <PageSubheading
        title={DIGEST_TITLE}
        description={DIGEST_DESCRIPTION}
        descriptionPlacement="side"
      />

      <DigestMobileCarousel cards={MOBILE_DIGEST_CARDS} className="mt-8 pb-[30px] md:hidden" />

      <DigestGrid
        cardsById={DIGEST_CARDS_BY_ID}
        layoutItems={DIGEST_GRID_LAYOUT.items}
        className="hidden md:grid mt-[55px]"
      />
    </section>
  );
}
