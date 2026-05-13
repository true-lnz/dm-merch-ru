export type HeaderNavigationItem = {
  href: string;
  label: string;
  children?: {
    href: string;
    label: string;
  }[];
};

export const staticHeaderSecondaryNavigation: HeaderNavigationItem[] = [
  { href: "/cases", label: "Кейсы" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];
