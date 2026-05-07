export type SocialIcon = "tg" | "vk" | "max";

export type SocialLink = {
  icon: SocialIcon;
  label: string;
  href: string;
};

export type SiteInfo = {
  brandName: string;
  email: string;
  phone: string;
  address: string;
  socials: SocialLink[];
  copyright: string;
};

export const SITE_PRIVACY_HREF = "/privacy";
export const SITE_PRIVACY_LABEL = "Политика конфиденциальности";

export const defaultSiteInfo: SiteInfo = {
  brandName: "Держи Марку!",
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
  copyright: "© «Держи Марку!», 2026",
};
