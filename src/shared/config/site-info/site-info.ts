export type SocialLink = {
  label: string;
  href: string;
  iconSrc: string;
  iconAlt: string;
};

export const siteInfo = {
  brandName: "Держи Марку!",
  legalName: "DM Merch",
  email: "zakaz@dm-merch.ru",
  phone: "+7 (937) 86-37-777",
  address: "г. Уфа, ул. Энтузиастов, д. 6",
  socials: [
    {
      label: "VK",
      href: "#",
      iconSrc: "/social-vk.svg",
      iconAlt: "VK",
    },
    {
      label: "MAX",
      href: "#",
      iconSrc: "/social-max.svg",
      iconAlt: "MAX",
    },
  ] satisfies SocialLink[],
  privacyLabel: "Политика конфиденциальности",
  copyright: `${new Date().getFullYear()} © Все права защищены`,
};
