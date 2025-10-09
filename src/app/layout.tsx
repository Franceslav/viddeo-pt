import type { Metadata } from "next";

import { Toaster } from "sonner";

import { TRPCProvider } from "./_trpc/Provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'),
  title: "Южный парк онлайн | Смотреть все серии бесплатно в хорошем качестве",
  description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего. Приключения Стэна, Кайла, Картмана и Кенни в вымышленном городе Южный парк. Полная коллекция эпизодов с русской озвучкой.",
  keywords: "южный парк, south park, смотреть онлайн, все серии, бесплатно, хорошее качество, анимация, комедия, стэн марш, кайл брофловски, эрик картман, кенни маккормик, русская озвучка, hd качество",
  authors: [{ name: "South Park Online Team" }],
  creator: "South Park Online",
  publisher: "South Park Online",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/KennyMcCormick.webp", type: "image/webp" }
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    other: [
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://southpark-online.ru",
    siteName: "Южный парк онлайн",
    title: "Южный парк онлайн | Смотреть все серии бесплатно",
    description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего. Приключения Стэна, Кайла, Картмана и Кенни в вымышленном городе Южный парк.",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Южный парк онлайн - смотреть все серии"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Южный парк онлайн | Смотреть все серии бесплатно",
    description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего.",
    images: ["/assets/hero.png"],
    creator: "@southpark-online"
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://southpark-online.ru"
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "entertainment"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFD700" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="South Park" />
      </head>
      <body
        className="font-sans antialiased"
      >
        <SessionProvider>
          <TRPCProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1 flex">
                {children}
              </div>
              <Footer />
            </div>
            <Toaster richColors />
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
