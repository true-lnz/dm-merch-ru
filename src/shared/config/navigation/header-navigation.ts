export type HeaderNavigationItem = {
  href: string;
  label: string;
  children?: {
    href: string;
    label: string;
  }[];
};

export const headerNavigation: HeaderNavigationItem[] = [
  {
    href: "/catalog",
    label: "Каталог",
    children: [
      { href: "/catalog", label: "Весь каталог" },
      { href: "/catalog?category=hoodies", label: "Толстовки" },
      { href: "/catalog?category=tshirts", label: "Футболки" },
      { href: "/catalog?category=outerwear", label: "Верхняя одежда" },
      { href: "/catalog?category=trousers", label: "Брюки" },
      { href: "/catalog?category=headwear", label: "Головные уборы" },
      { href: "/catalog?category=bags", label: "Сумки и рюкзаки" },
      { href: "/catalog?category=souvenirs", label: "Сувенирная продукция" },
      { href: "/catalog?category=custom-souvenirs", label: "Авторская сувенирная продукция" },
      { href: "/catalog?category=business-accessories", label: "Деловые аксессуары" },
      { href: "/catalog?category=sportswear", label: "Спортивная одежда" },
    ],
  },
  { href: "/cases", label: "Кейсы" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];
