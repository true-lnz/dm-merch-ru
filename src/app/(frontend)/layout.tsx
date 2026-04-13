import { Toaster } from "@/shared/ui/sonner";
import { CookieWarning } from "@/widgets/cookie-warning";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Держи Марку!",
    template: "%s — Держи Марку!",
  },
  description: "Мерч-агентство: каталог, кейсы, блог и контакты.",
  keywords: "Купить мерч, производство мерча, сувернирка, сувенирная продукция, сделать принт, изготовить футболки, толстовки, мерч для бизнеса, корпоративный мерч",
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "android-chrome",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="text-base">
      <body>
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
          <CookieWarning />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
