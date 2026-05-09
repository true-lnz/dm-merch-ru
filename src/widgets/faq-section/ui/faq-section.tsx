import { getFaqSectionData } from "../model/get-faq-section-data";
import { FaqSectionContent } from "./faq-section-content";

export async function FaqSection() {
  const faqSection = await getFaqSectionData();

  if (!faqSection) {
    return null;
  }

  return (
    <FaqSectionContent
      image={faqSection.image}
      title={faqSection.title}
      items={faqSection.items}
    />
  );
}
