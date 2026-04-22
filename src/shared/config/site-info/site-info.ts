export type SocialLink = {
  icon: "tg" | "vk" | "max";
  label: string;
  href: string;
};

export const siteInfo = {
  brandName: "Держи Марку!",
  legalName: "DM Merch",
  email: "zakaz@dm-merch.ru",
  phone: "+7 (937) 86-37-777",
  address: "г. Уфа, ул. Энтузиастов, д. 6",
  socials: [
    {
      icon: "tg",
      label: "Telegram",
      href: "#",
    },
    {
      icon: "vk",
      label: "VK",
      href: "#",
    },
    {
      icon: "max",
      label: "MAX",
      href: "#",
    },
  ] satisfies SocialLink[],
  privacyHref: "/privacy",
  privacyLabel: "Политика конфиденциальности",
  copyright: `© «Держи Марку!», ${new Date().getFullYear()}`,
};
