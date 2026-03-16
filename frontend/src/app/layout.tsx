import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Korean subset — covers all Hangul glyphs
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heeang Jewelry",
  description: "Art Jewelry & Fine Jewelry",
};

// Font variable classes exposed globally so locale layout can use them
export const fontVariables = `${inter.variable} ${cormorant.variable} ${notoSansKR.variable}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-intl pattern: locale layout provides <html> and <body>
  // Root layout just injects globals and returns children
  return children;
}
