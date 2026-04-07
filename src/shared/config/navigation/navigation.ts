export type NavigationChildItem = {
  href: string;
  label: string;
  description?: string;
};

export type NavigationItem = {
  href: string;
  label: string;
  children?: NavigationChildItem[];
};

export const siteNavigation: NavigationItem[] = [
  { href: "/", label: "Главная" },
  {
    href: "/catalog",
    label: "Каталог",
    children: [
      {
        href: "/catalog",
        label: "Весь каталог",
        description: "Все категории мерча и базовые подборки.",
      },
      {
        href: "/catalog?group=corporate",
        label: "Корпоративный мерч",
        description: "Наборы и позиции для команды, onboarding и ивентов.",
      },
      {
        href: "/catalog?group=apparel",
        label: "Брендированная одежда",
        description: "Худи, футболки и текстиль с фирменной айдентикой.",
      },
      {
        href: "/catalog?group=gifts",
        label: "Подарки и аксессуары",
        description: "Промо-подарки, welcome packs и деловые аксессуары.",
      },
    ],
  },
  { href: "/cases", label: "Кейсы" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];
