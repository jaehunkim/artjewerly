import type { Metadata } from "next";
import { Noto_Serif_KR, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const pretendard = localFont({
  src: [
    {
      path: "./fonts/PretendardVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heeang Jewelry",
  description: "Art Jewelry & Fine Jewelry",
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

export const fontVariables = `${notoSerifKR.variable} ${pretendard.variable} ${cormorant.variable}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-intl pattern: locale layout provides <html> and <body>
  // Root layout just injects globals and returns children
  return children;
}
