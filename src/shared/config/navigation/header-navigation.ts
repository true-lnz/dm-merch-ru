export type HeaderNavigationItem = {
  href: string;
  label: string;
};

export const headerNavigation: HeaderNavigationItem[] = [
  { href: "/catalog", label: "Каталог" },
  { href: "/cases", label: "Кейсы" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];