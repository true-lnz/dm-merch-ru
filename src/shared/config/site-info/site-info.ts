export type SocialLink = {
  icon: "tg" | "vk" | "max";
  label: string;
  href: string;
};

export const siteInfo = {
  brandName: "Держи Марку!",
  legalName: "DM Merch",
  email: "zakaz@dm-merch.ru",
  phone: "+7 (931) 107-77-75",
  address: "г. Уфа, ул. Энтузиастов, д. 6",
  socials: [
    {
      icon: "tg",
      label: "Telegram",
      href: "https://t.me/dm_merch",
    },
    {
      icon: "vk",
      label: "VK",
      href: "#",
    },
    {
      icon: "max",
      label: "MAX",
      href: "https://max.ru/join/E11Gq-pvtQdlstRI7bYES_M64Flg9ocThjJga6bHJA0",
    },
  ] satisfies SocialLink[],
  privacyHref: "/privacy",
  privacyLabel: "Политика конфиденциальности",
  copyright: `© «Держи Марку!», ${new Date().getFullYear()}`,
};
