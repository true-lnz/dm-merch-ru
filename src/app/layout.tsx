import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { Geist } from "next/font/google";
import { cn } from "@/shared/lib/cn";
import { Toaster } from "@/shared/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "DM Merch",
    template: "%s | DM Merch",
  },
  description: "Мерч-агентство: каталог, кейсы, блог и контакты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" >
      <body>
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
