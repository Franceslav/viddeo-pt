import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
