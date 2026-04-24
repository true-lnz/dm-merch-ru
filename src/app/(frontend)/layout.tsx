import { WishlistProvider } from "@/shared/lib/wishlist";
import { ClientRuntimeMonitor } from "@/shared/ui/client-runtime-monitor";
import { Toaster } from "@/shared/ui/sonner";
import { PageTransitionProvider } from "@/shared/ui/page-transition";
import { CookieWarning } from "@/widgets/cookie-warning";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

const YANDEX_METRIKA_ID = 108741987;

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
        {/* Yandex.Metrika counter */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) return;
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${YANDEX_METRIKA_ID}, "init", {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: "dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce: true,
                trackLinks: true
              });
            `,
          }}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
        <ClientRuntimeMonitor />
        <Suspense fallback={null}>
          <PageTransitionProvider>
            <WishlistProvider>
              <div className="site-shell">
                <Header />
                <main className="site-main">{children}</main>
                <Footer />
                <CookieWarning />
              </div>
            </WishlistProvider>
          </PageTransitionProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
