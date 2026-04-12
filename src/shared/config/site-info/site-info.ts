export type SocialLink = {
  icon: "vk" | "max";
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
  privacyLabel: "Политика конфиденциальности",
  copyright: `${new Date().getFullYear()} © Все права защищены`,
};
