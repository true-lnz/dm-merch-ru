export type NavigationItem = {
  href: string;
  label: string;
};

export const siteNavigation: NavigationItem[] = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/cases", label: "Кейсы" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];
