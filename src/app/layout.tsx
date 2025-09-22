import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";

import { TRPCProvider } from "./_trpc/Provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "@/styles/globals.css";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Viddeo",
  description: "Viddeo is a video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
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
